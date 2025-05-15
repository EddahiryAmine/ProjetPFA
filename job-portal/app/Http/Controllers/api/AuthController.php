<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'role'     => 'required|in:candidat,employeur'
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role'     => $request->role,
    ]);

    // ✅ Création automatique de l'employeur si rôle = "employeur"
    if ($user->role === 'employeur') {
        \App\Models\Employeur::create([
            'user_id' => $user->id,
            'entreprise_id' => null, // à définir plus tard
        ]);
    }elseif($user->role === 'candidat'){
        Candidat::create([
            'user_id'=>$user->id,
            'cv_id'=>null,
            'portfolio_link' => null,
            'titre_diplome' => null,
            'profile_completed' => false,
        ]);
    }

    Auth::login($user);

    event(new Registered($user));

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Compte créé avec succès. Vérifiez votre email.',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_completed' => $user->role === 'candidat'
                ? optional(Candidat::where('user_id', $user->id)->first())->profile_completed
                : null,
        ],
    ], 201);
}

public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
        'role'     => 'required|in:candidat,employeur'
    ]);

    $user = User::where('email', $request->email)
                ->where('role', $request->role)
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Identifiants incorrects.'],
        ]);
    }

    if (!$user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Veuillez vérifier votre adresse email.'], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    // Pour les candidats : vérifier existence du profil et son état
    $candidatProfile = null;
    $profileCompleted = null;

    if ($user->role === 'candidat') {
        $candidatProfile = Candidat::where('user_id', $user->id)->first();

        if (!$candidatProfile || !$candidatProfile->profile_completed) {
            $profileCompleted = false;
        } else {
            $profileCompleted = true;
        }
    }

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_completed' => $profileCompleted,
        ],
    ]);
}


    public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete(); 
    return response()->json(['message' => 'Déconnexion réussie.']);
}

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_completed' => $user->role === 'candidat'
                ? optional(Candidat::where('user_id', $user->id)->first())->profile_completed
                : null,
        ]);    }
}
