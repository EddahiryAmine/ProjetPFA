<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OffreEmploi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Statistiques;

class OffreEmploiController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $offres = $user->employeur
            ->offres()
            ->with(['employeur', 'preferences', 'statistiques'])
            ->get();
    
        return response()->json($offres);
    }

    public function offresPourCandidat(Request $request)
    {
        $user = $request->user();
    
        $candidat = \App\Models\Candidat::with('preferences')->where('user_id', $user->id)->first();
    
        if (!$candidat) {
            return response()->json([], 200);
        }
    
        $preferenceIds = $candidat->preferences->pluck('id')->toArray();
    
       
        $offres = \App\Models\OffreEmploi::with([
                'employeur.user',
                'employeur.entreprise',
                'preferences'
            ])
            ->whereHas('preferences', function ($query) use ($preferenceIds) {
                $query->whereIn('preferences.id', $preferenceIds);
            })
            ->get();
    
        return response()->json($offres);
    }

   public function show($id)
{
    $offre = OffreEmploi::with('statistiques')->findOrFail($id);

    // Incrémenter le nombre de vues
    if ($offre->statistiques) {
        $offre->statistiques->increment('nombreVues');
    }

    return response()->json($offre);
}



    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'salaire' => 'nullable|numeric',
            'localisation' => 'required|string|max:255',
            'dateExpiration' => 'required|date',
            'preferences' => 'array|max:3',
            'preferences.*' => 'exists:preferences,id'
        ]);
    
        $user = $request->user();
        $employeur = $user->employeur;
    
        if (!$employeur) {
            return response()->json(['message' => 'Aucun employeur trouvé.'], 404);
        }
    
        $statistiques = \App\Models\Statistiques::create([
            'nombreVues' => 0,
            'nombreCandidatures' => 0,
        ]);
    
        $offre = OffreEmploi::create([
            'employeur_id' => $employeur->id,
            'statistiques_id' => $statistiques->id,
            'titre' => $request->titre,
            'description' => $request->description,
            'salaire' => $request->salaire,
            'localisation' => $request->localisation,
            'dateExpiration' => $request->dateExpiration,
        ]);
    
        if ($request->has('preferences')) {
            $offre->preferences()->attach($request->preferences);
        }
    
        return response()->json([
            'message' => 'Offre créée avec succès.',
            'offre' => $offre->load('preferences')
        ], 201);
    }
    
    

public function update(Request $request, $id)
{
    $user = Auth::user();
    $employeur = $user->employeur;

    $offre = $employeur->offres()->findOrFail($id);

    $request->validate([
        'titre' => 'required|string|max:255',
        'description' => 'required|string',
        'salaire' => 'nullable|numeric',
        'localisation' => 'nullable|string|max:255',
        'dateExpiration' => 'nullable|date',
    ]);

    $offre->update([
        'titre' => $request->titre,
        'description' => $request->description,
        'salaire' => $request->salaire,
        'localisation' => $request->localisation,
        'dateExpiration' => $request->dateExpiration,
    ]);

    if ($request->has('preferences')) {
        $offre->preferences()->sync($request->preferences);
    }

    return response()->json([
        'message' => 'Offre modifiée avec succès.',
        'offre' => $offre->load('preferences'),
    ]);
}

public function destroy($id)
{
    $user = Auth::user();
    $employeur = $user->employeur;

    $offre = $employeur->offres()->findOrFail($id);

    $offre->delete();

    return response()->json(['message' => 'Offre supprimée avec succès']);
}


public function statistiquesPourEmployeur()
{
    $user = Auth::user();
    $employeur = $user->employeur;

    if (!$employeur) {
        return response()->json(['message' => 'Employeur introuvable'], 403);
    }

    $offres = OffreEmploi::with('statistiques')
        ->where('employeur_id', $employeur->id)
        ->get();

    $offreIds = $offres->pluck('id');

    $totalOffres = $offres->count();
    $totalVues = $offres->sum(fn($offre) => $offre->statistiques->nombreVues ?? 0);
    $totalCandidatures = $offres->sum(fn($offre) => $offre->statistiques->nombreCandidatures ?? 0);

    // Ajout des stats approuvées/rejetées
    $totalApprouvees = \App\Models\Candidature::whereIn('offre_emploi_id', $offreIds)
        ->where('statut', 'approuve')
        ->count();

    $totalRejetees = \App\Models\Candidature::whereIn('offre_emploi_id', $offreIds)
        ->where('statut', 'rejete')
        ->count();

    // Variation fictive (à remplacer par un vrai calcul plus tard)
    $progressionVues = rand(-20, 30);

    return response()->json([
        'total_offres' => $totalOffres,
        'total_vues' => $totalVues,
        'total_candidatures' => $totalCandidatures,
        'total_approuvees' => $totalApprouvees,
        'total_rejetees' => $totalRejetees,
        'variation_vues' => $progressionVues,
    ]);
}

}
