<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preferences extends Model
{
    protected $table = 'preferences';
    protected $fillable = ['nom'];

    public function candidats()
    {
        return $this->belongsToMany(Candidat::class, 'candidat_preferences', 'preference_id', 'candidat_id');
    }

    public function offres()
{
    return $this->belongsToMany(OffreEmploi::class, 'offre_emploi_preference');
}

}
