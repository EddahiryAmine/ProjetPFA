<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Candidat extends User
{
    use HasFactory;

    protected $fillable = ['cv_id', 'portfolio'];

    public function cv(): BelongsTo
    {
        return $this->belongsTo(CV::class);
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class);
    }
    public function preferences()
{
    return $this->belongsToMany(Preferences::class, 'candidat__preferences');
}
}
