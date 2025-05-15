<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Conversation;

class MessageController extends Controller
{
   
    public function show($id)
    {
        try {
            $conversation = Conversation::with(['messages.user'])->findOrFail($id);

            $conversation->messages->each(function ($message) {
                $user = $message->user;
                $message->role = $user->candidat ? 'candidat' : ($user->employeur ? 'employeur' : 'inconnu');
            });

            return response()->json($conversation);
        } catch (\Exception $e) {
            \Log::error('Erreur dans MessageController@show', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'conversation_id' => $id
            ]);

            return response()->json(['message' => 'Erreur serveur lors de la récupération des messages.'], 500);
        }
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'contenu' => 'required|string',
        ]);

        $user = Auth::user();

        $message = Message::create([
            'user_id' => $user->id,
            'conversation_id' => $request->conversation_id,
            'contenu' => $request->contenu,
            'dateEnvoi' => now(),
        ]);

        return response()->json([
            'message' => 'Message envoyé.',
            'data' => $message
        ]);
    }
 public function conversationsPourEmployeur()
{
    try {
        $user = Auth::user();
        if (!$user || !$user->employeur) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $conversations = Conversation::with(['candidat.user']) // ← assure que tu as bien défini la relation
            ->where('employeur_id', $user->employeur->id)
            ->get();

        return response()->json($conversations);
    } catch (\Exception $e) {
        \Log::error('Erreur conversation employeur : '.$e->getMessage());
        return response()->json(['message' => 'Erreur serveur.'], 500);
    }
}

public function conversationsPourCandidat()
{
    try {
        $user = Auth::user();
        if (!$user || !$user->candidat) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $candidat = $user->candidat;

        $conversations = Conversation::with(['employeur.user'])
            ->where('candidat_id', $candidat->id)
            ->get();

        return response()->json($conversations);
    } catch (\Exception $e) {
        \Log::error('Erreur conversation candidat : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur serveur.'], 500);
    }
}








}
