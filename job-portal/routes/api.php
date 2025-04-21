<?php

use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VerificationController; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'customVerify'])
    ->middleware(['signed'])
    ->name('verification.verify');


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Lien de vérification envoyé.']);
    })->middleware('throttle:6,1')->name('verification.send');
});
