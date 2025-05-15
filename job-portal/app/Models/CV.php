<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CV extends Model
{
    use HasFactory;

    protected $table = 'c_v_s';

    protected $fillable = ['fichier'];

    protected $appends = ['url']; // 👈 Ajoute cette ligne

    public function getUrlAttribute()
    {
        return asset('storage/cv/' . $this->fichier);
    }
}
