<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class VerificationController extends Controller
{
    
    
    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '/?verified=true');
        }
    
        $request->fulfill(); // Marque l'e-mail comme vérifié
    
        return redirect(env('FRONTEND_URL') . '/?verified=true');
    }


    public function customVerify(Request $request, $id, $hash)
{
    $user = User::findOrFail($id);

    if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        return response()->json(['message' => 'Lien de vérification invalide.'], 403);
    }

    if ($user->hasVerifiedEmail()) {
        return Redirect::to(env('FRONTEND_URL') . '/?verified=already');
    }

    $user->markEmailAsVerified();
    event(new Verified($user));

    return Redirect::to(env('FRONTEND_URL') . '/?verified=true');
}
    
}
