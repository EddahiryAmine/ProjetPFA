<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidat_Preferences extends Model
{
    protected $table = 'candidat_preferences';

    protected $fillable = ['candidat_id', 'preference_id'];
}
