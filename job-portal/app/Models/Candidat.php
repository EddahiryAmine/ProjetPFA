<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre_diplome',
        'portfolio_link',
        'cv_id',
        'profile_completed',
        
    ];

    public function cv(): BelongsTo
    {
        return $this->belongsTo(CV::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class);
    }

    public function preferences()
    {
        return $this->belongsToMany(Preferences::class, 'candidat_preferences', 'candidat_id', 'preference_id');
    }
    public function conversations()
{
    return $this->hasMany(Conversation::class);
}
}
