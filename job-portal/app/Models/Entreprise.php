<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entreprise extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'adresse'];

    public function employeurs(): HasMany
    {
        return $this->hasMany(Employeur::class);
    }
}
