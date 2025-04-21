<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preferences extends Model
{
    protected $fillable = ['nom'];

    public function candidats()
    {
        return $this->belongsToMany(Candidat::class, 'candidat_preference');
    }

    public function offres()
    {
        return $this->hasMany(OffreEmploi::class, 'preference_id');
    }
}
