<?php

namespace App\Http\Controllers\Api;

use App\Models\Preferences;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class PreferenceController extends Controller
{
    /**
     * Affiche toutes les préférences.
     */
    public function index()
    {
        try {
            $preferences = Preferences::all();
            
            if ($preferences->isEmpty()) {
                return response()->json(['message' => 'Aucune préférence trouvée.'], 404);
            }

            return response()->json($preferences);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Une erreur interne est survenue.'], 500);
        }
    }
}
