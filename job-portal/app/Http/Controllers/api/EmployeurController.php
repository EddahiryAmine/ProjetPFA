<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Entreprise;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EmployeurController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user();
    
        $employeur = $user->employeur;
    
        if (!$employeur) {
            return response()->json([
                'message' => 'Aucun profil employeur trouvé pour cet utilisateur.',
                'user' => $user,
            ], 404);
        }
    
        $employeur->load('entreprise');
    
        return response()->json([
            'user' => $user,
            'employeur' => $employeur,
        ]);
    }
    
    public function checkProfileCompletion(Request $request)
{
    $user = $request->user();
    $employeur = $user->employeur;

    return response()->json([
        'profileCompleted' => $employeur && $employeur->entreprise_id !== null,
    ]);
}
public function ajouterEntreprise(Request $request)
{
    $user = $request->user();

    if ($user->employeur && $user->employeur->entreprise_id) {
        return response()->json([
            'message' => 'Vous avez déjà une entreprise associée.'
        ], 403);
    }

    $request->validate([
        'nom' => 'required|string|max:255',
        'description' => 'required|string',
        'adresse' => 'required|string|max:255',
    ]);

    $entreprise = Entreprise::create([
        'nom' => $request->nom,
        'description' => $request->description,
        'adresse' => $request->adresse,
    ]);

    // Sauvegarde entreprise_id dans employeur
    $user->employeur->entreprise_id = $entreprise->id;
    $user->employeur->save();

    return response()->json([
        'message' => 'Entreprise créée et assignée avec succès',
        'entreprise' => $entreprise,
    ], 201);
}


public function assignEntreprise(Request $request)
{
    $request->validate([
        'entreprise_id' => 'required|exists:entreprises,id',
    ]);

    $employeur = $request->user()->employeur;

    $employeur->entreprise_id = $request->entreprise_id;
    $employeur->save();

    return response()->json([
        'message' => 'Entreprise assignée avec succès!',
        'employeur' => $employeur
    ]);
}

public function updatePhoto(Request $request)
{
    $user = $request->user();
    $employeur = $user->employeur;

    $request->validate([
        'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('photo')) {
        $photo = $request->file('photo');
        $path = $photo->store('photos/employeurs', 'public');

        if ($employeur->photo) {
            Storage::disk('public')->delete($employeur->photo);
        }

        $employeur->photo = $path;
        $employeur->save();
    }

    return response()->json([
        'message' => 'Photo mise à jour avec succès.',
        'photo_url' => asset('storage/' . $employeur->photo)
    ]);
}

public function getEmployeurById($id)
{
    $employeur = \App\Models\Employeur::with(['user', 'entreprise'])->find($id);

    if (!$employeur) {
        return response()->json(['message' => 'Employeur non trouvé'], 404);
    }

    return response()->json([
        'employeur' => $employeur,
        'user' => $employeur->user,
        'entreprise' => $employeur->entreprise,
    ]);
}



    


}
