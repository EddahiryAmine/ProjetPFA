<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Candidat;
use App\Models\Preferences;
use App\Models\Candidat_Preferences;
use App\Models\CV;

class CandidatController extends Controller
{
    /**
     * Compléter le profil du candidat
     */
    public function completeProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'candidat') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'titre_diplome'     => 'required|string|max:255',
            'portfolio_link'    => 'nullable|url',
            'cv'                => 'required|file|mimes:pdf,doc,docx|max:2048',
            'preferences'       => 'required|array|min:3|max:6',
            'preferences.*'     => 'integer|exists:preferences,id',
        ]);

        // Déplacement du fichier CV vers public/cv
        $cvFile = $request->file('cv');
        $filename = uniqid() . '.' . $cvFile->getClientOriginalExtension();
        $cvFile->move(public_path('cv'), $filename);
        $path = 'cv/' . $filename;

        $cv = CV::create([
            'fichier' => $path,
        ]);

        $candidat = Candidat::where('user_id', $user->id)->first();

        if (!$candidat) {
            return response()->json(['message' => 'Profil candidat introuvable.'], 404);
        }

        $candidat->update([
            'titre_diplome'     => $validated['titre_diplome'],
            'portfolio_link'    => $validated['portfolio_link'],
            'cv_id'             => $cv->id,
            'profile_completed' => true,
        ]);

        // Mise à jour des préférences
        Candidat_Preferences::where('candidat_id', $candidat->id)->delete();
        foreach ($validated['preferences'] as $prefId) {
            Candidat_Preferences::create([
                'candidat_id'   => $candidat->id,
                'preference_id' => $prefId,
            ]);
        }

        return response()->json(['message' => 'Profil complété avec succès']);
    }

    /**
     * Retourner les préférences disponibles
     */
    public function getPreferences()
    {
        $preferences = Preferences::select('id', 'nom')->get();

        return response()->json([
            'success' => true,
            'data'    => $preferences,
        ]);
    }

    /**
     * Retourner les informations du candidat connecté
     */
    public function me()
    {
        $user = Auth::user();
        $candidat = Candidat::with(['preferences', 'cv'])->where('user_id', $user->id)->first();

        if (!$candidat) {
            return response()->json([
                'id'                => $user->id,
                'email'             => $user->email,
                'name'              => $user->name,
                'role'              => $user->role,
                'profile_completed' => false,
                'cv_id'             => null,
                'cv_url'            => null,
                'portfolio_link'    => null,
                'titre_diplome'     => null,
                'preferences'       => [],
            ]);
        }

        return response()->json([
            'id'                => $user->id,
            'email'             => $user->email,
            'name'              => $user->name,
            'role'              => $user->role,
            'profile_completed' => $candidat->profile_completed,
            'cv_id'             => $candidat->cv_id,
            'cv_url'            => $candidat->cv ? asset($candidat->cv->fichier) : null,
            'portfolio_link'    => $candidat->portfolio_link,
            'titre_diplome'     => $candidat->titre_diplome,
            'preferences'       => $candidat->preferences->pluck('nom'),
        ]);
    }

    /**
     * Mettre à jour le profil du candidat
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'candidat') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email,' . $user->id,
            'titre_diplome'  => 'nullable|string|max:255',
            'portfolio_link' => 'nullable|url',
            'cv'             => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'preferences'    => 'nullable|array|min:3|max:6',
            'preferences.*'  => 'integer|exists:preferences,id',
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        $candidat = Candidat::where('user_id', $user->id)->first();

        if (!$candidat) {
            return response()->json(['message' => 'Profil candidat introuvable.'], 404);
        }

        $candidat->titre_diplome   = $validated['titre_diplome'] ?? $candidat->titre_diplome;
        $candidat->portfolio_link = $validated['portfolio_link'] ?? $candidat->portfolio_link;

        // Si un nouveau CV est fourni
        if ($request->hasFile('cv')) {
            $cvFile = $request->file('cv');
            $filename = uniqid() . '.' . $cvFile->getClientOriginalExtension();
            $cvFile->move(public_path('cv'), $filename);
            $path = 'cv/' . $filename;

            $cv = CV::create([
                'fichier' => $path,
            ]);

            $candidat->cv_id = $cv->id;
        }

        $candidat->save();

        // Mise à jour des préférences
        if (!empty($validated['preferences'])) {
            Candidat_Preferences::where('candidat_id', $candidat->id)->delete();

            foreach ($validated['preferences'] as $prefId) {
                Candidat_Preferences::create([
                    'candidat_id'   => $candidat->id,
                    'preference_id' => $prefId,
                ]);
            }
        }

        return response()->json(['message' => 'Profil mis à jour avec succès']);
    }
}
