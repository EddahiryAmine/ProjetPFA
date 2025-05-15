<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'conversation_id', 'contenu', 'dateEnvoi'];
    

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
    

    
}