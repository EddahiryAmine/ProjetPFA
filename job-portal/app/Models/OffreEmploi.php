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

    public function statistiques(): HasOne
    {
        return $this->hasOne(Statistiques::class);
    }
    public function preference()
{
    return $this->belongsTo(Preferences::class, 'preference_id');
}
}
