<?php

use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VerificationController; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeurController; 
use App\Http\Controllers\Api\OffreEmploiController;
use App\Http\Controllers\Api\PreferenceController;
use App\Http\Controllers\Api\CandidatController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\CVController;
use App\Http\Controllers\Api\MessageController;




Route::get('/test', [TestController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/candidat/update-profile', [CandidatController::class, 'updateProfile']);


Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'customVerify'])
    ->middleware(['signed'])
    ->name('verification.verify');

Route::middleware('auth:sanctum')->get('/offres/candidat', [OffreEmploiController::class, 'offresPourCandidat']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Lien de vérification envoyé.']);
    })->middleware('throttle:6,1')->name('verification.send');
});

Route::middleware('auth:sanctum')->get( '/me', action: [AuthController::class, 'me']);



Route::middleware('auth:sanctum')->get('/profil/employeur', [EmployeurController::class, 'profile']);
Route::middleware('auth:sanctum')->get('/check-profile-completion', [EmployeurController::class, 'checkProfileCompletion']);
Route::middleware('auth:sanctum')->post('/profil/employeur/ajouter-entreprise', [EmployeurController::class, 'ajouterEntreprise']);
Route::middleware('auth:sanctum')->post('/assign-entreprise', [EmployeurController::class, 'assignEntreprise']);
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/offres', [OffreEmploiController::class, 'index']);
    Route::post('/offres', [OffreEmploiController::class, 'store']);
    Route::get('/offres/{id}', [OffreEmploiController::class, 'show']);
    Route::put('/offres/{id}', [OffreEmploiController::class, 'update']);
    Route::delete('/offres/{id}', [OffreEmploiController::class, 'destroy']);
});

Route::get('/preferences', [PreferenceController::class,'index']);
Route::get('employeur/preferences', [PreferenceController::class,'index']);

Route::middleware('auth:sanctum')->post('/employeur/photo', [EmployeurController::class, 'updatePhoto']);

Route::middleware('auth:sanctum')->get('/offres/{id}', [OffreEmploiController::class, 'show']);
Route::middleware('auth:sanctum')->post('/candidatures', [CandidatureController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/candidat/complete-profile', [CandidatController::class, 'completeProfile']);
    Route::get('/candidat/me', [CandidatController::class, 'me']);
    Route::get('/preferences', [CandidatController::class, 'getPreferences']); // ✅ ici uniquement
});

Route::get('/employeurs/{id}', [EmployeurController::class, 'getEmployeurById']);

Route::middleware('auth:sanctum')->post('/candidatures', [CandidatureController::class, 'store']);
Route::middleware('auth:sanctum')->get('/employeur/candidatures', [CandidatureController::class, 'indexPourEmployeur']);
Route::middleware('auth:sanctum')->get('/candidats/{id}', [CandidatureController::class, 'show']);

Route::middleware('auth:sanctum')->get('/cv/{id}/telecharger', [CVController::class, 'telecharger']);
Route::middleware('auth:sanctum')->put('/candidatures/{id}/statut', [CandidatureController::class, 'updateStatut']);
Route::middleware('auth:sanctum')->get('/candidat/candidatures', [CandidatureController::class, 'indexPourCandidat']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations/{id}/messages', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);


});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations/employeur', [MessageController::class, 'conversationsPourEmployeur']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employeur/statistiques', [OffreEmploiController::class, 'statistiquesPourEmployeur']);
});
Route::middleware('auth:sanctum')->get('/conversations/candidat', [MessageController::class, 'conversationsPourCandidat']);

