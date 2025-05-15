<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class CVController extends Controller
{
    public function telecharger($id)
{
    $cv = \App\Models\CV::find($id);

    if (!$cv || !$cv->fichier) {
        return response()->json(['message' => 'CV introuvable'], 404);
    }

    $path = storage_path('app/public/cv/' . $cv->fichier);

    if (!file_exists($path)) {
        return response()->json(['message' => 'Fichier non trouvé sur le serveur'], 404);
    }

    return response()->download($path, $cv->fichier);
}

}
