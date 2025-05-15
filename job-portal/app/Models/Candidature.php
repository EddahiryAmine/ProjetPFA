<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;


class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidat_id',
        'offre_emploi_id',
        'statut',
        'dateSoumission',
    ];
    public function candidat(): BelongsTo
    {
        return $this->belongsTo(Candidat::class);
    }

    public function offreEmploi(): BelongsTo
    {
        return $this->belongsTo(OffreEmploi::class);
    }
}

