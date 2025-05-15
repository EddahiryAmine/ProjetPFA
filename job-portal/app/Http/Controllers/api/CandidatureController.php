<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\{Candidature, OffreEmploi, Candidat, Message, Conversation, Notification};

class CandidatureController extends Controller
{
   public function store(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié.'], 401);
    }

    $candidat = $user->candidat;
    if (!$candidat) {
        return response()->json(['message' => 'Profil candidat introuvable.'], 404);
    }

    $request->validate([
        'offre_emploi_id' => 'required|exists:offre_emplois,id',
    ]);

    $offreId = $request->offre_emploi_id;

    // Vérifie si le candidat a déjà postulé
    $dejaPostule = Candidature::where('candidat_id', $candidat->id)
        ->where('offre_emploi_id', $offreId)
        ->exists();

    if ($dejaPostule) {
        return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
    }

    // Créer la candidature
    $candidature = Candidature::create([
        'candidat_id' => $candidat->id,
        'offre_emploi_id' => $offreId,
        'statut' => 'en_attente',
        'dateSoumission' => now(),
    ]);

    // 🔁 Incrémente le compteur de candidatures
    $offre = OffreEmploi::with('statistiques')->find($offreId);
    if ($offre && $offre->statistiques) {
        $offre->statistiques->increment('nombreCandidatures');
    }

    return response()->json([
        'message' => 'Candidature soumise avec succès.',
        'candidature' => $candidature,
    ], 201);
}


    public function indexPourEmployeur()
    {
        $user = Auth::user();
        if (!$user || !$user->employeur) return response()->json(['message' => 'Accès réservé aux employeurs.'], 403);

        $employeur = $user->employeur;

        $candidatures = Candidature::whereHas('offreEmploi', function ($query) use ($employeur) {
            $query->where('employeur_id', $employeur->id);
        })->with(['offreEmploi', 'candidat.user'])->get()
        ->map(function ($cand) use ($employeur) {
            $conversation = Conversation::where('employeur_id', $employeur->id)
                ->where('candidat_id', $cand->candidat_id)
                ->first();

            $cand->conversation_id = $conversation?->id;
            return $cand;
        });

        return response()->json($candidatures);
    }

    public function indexPourCandidat()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Utilisateur non authentifié'], 401);

        $candidat = Candidat::where('user_id', $user->id)->first();
        if (!$candidat) return response()->json(['message' => 'Aucun profil candidat trouvé'], 404);

        $candidatures = Candidature::with('offreEmploi')
            ->where('candidat_id', $candidat->id)
            ->get();

        return response()->json($candidatures);
    }

    public function show($id)
    {
        $candidat = Candidat::with(['user', 'cv', 'preferences'])->find($id);
        if (!$candidat) return response()->json(['message' => 'Candidat introuvable'], 404);

        return response()->json($candidat);
    }

    public function updateStatut(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || !$user->employeur) return response()->json(['message' => 'Accès réservé aux employeurs.'], 403);

            $request->validate(['statut' => 'required|in:approuve,rejete']);

            $candidature = Candidature::with('offreEmploi', 'candidat.user')->findOrFail($id);

            if ($candidature->offreEmploi->employeur_id !== $user->employeur->id) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }

            $candidature->statut = $request->statut;
            $candidature->save();

            if ($request->statut === 'approuve') {
                $conversation = Conversation::firstOrCreate([
                    'employeur_id' => $user->employeur->id,
                    'candidat_id' => $candidature->candidat->id,
                ]);

                Message::create([
                    'user_id' => $user->id,
                    'conversation_id' => $conversation->id,
                    'contenu' => 'Bonjour, votre candidature a été approuvée. Vous pouvez discuter ici.',
                    'dateEnvoi' => now(),
                ]);

                $candidature->conversation_id = $conversation->id;
            }

            if ($request->statut === 'rejete') {
                Notification::create([
                    'user_id' => $candidature->candidat->user->id,
                    'contenu' => 'Votre candidature à l\'offre "' . $candidature->offreEmploi->titre . '" a été rejetée.',
                    'dateEnvoi' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Statut de la candidature mis à jour.',
                'candidature' => $candidature
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur updateStatut: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur interne.'], 500);
        }
    }
}
