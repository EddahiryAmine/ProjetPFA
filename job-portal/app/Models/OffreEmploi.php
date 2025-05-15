<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OffreEmploi extends Model
{
    use HasFactory;

    protected $fillable = ['employeur_id', 'statistiques_id', 'titre', 'description', 'salaire', 'localisation', 'dateExpiration'];

    public function employeur(): BelongsTo
    {
        return $this->belongsTo(Employeur::class);
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class);
    }

    public function statistiques(): BelongsTo
{
    return $this->belongsTo(Statistiques::class, 'statistiques_id');
}
public function preferences()
{
    return $this->belongsToMany(Preferences::class, 'offre_emploi_preference', 'offre_emploi_id', 'preference_id');
}


public function statistiquesGlobales()
{
    $user = Auth::user();
    if (!$user || !$user->employeur) {
        return response()->json(['message' => 'Accès réservé aux employeurs.'], 403);
    }

    $offres = $user->employeur->offres()->with('statistiques')->get();

    $totaux = [
        'nombreVues' => 0,
        'nombreCandidatures' => 0,
    ];

    foreach ($offres as $offre) {
        $totaux['nombreVues'] += $offre->statistiques->nombreVues ?? 0;
        $totaux['nombreCandidatures'] += $offre->statistiques->nombreCandidatures ?? 0;
    }

    return response()->json($totaux);
}

}
