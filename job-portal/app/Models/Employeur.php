<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employeur extends User
{
    use HasFactory;

    protected $fillable = ['entreprise_id'];

    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function offres(): HasMany
    {
        return $this->hasMany(OffreEmploi::class);
    }
}
