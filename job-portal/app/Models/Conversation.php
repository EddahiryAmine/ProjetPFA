<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['employeur_id', 'candidat_id'];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
    public function candidat()
{
    return $this->belongsTo(Candidat::class);
}

public function employeur()
{
    return $this->belongsTo(Employeur::class);
}

}
