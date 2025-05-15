<?php
namespace App\Notifications;

use App\Models\Candidature;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NouvelleCandidatureNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $candidature;

    public function __construct(Candidature $candidature)
    {
        $this->candidature = $candidature;
    }

    public function via($notifiable)
    {
        return ['mail']; // ou ['database', 'mail']
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Nouvelle candidature reçue")
            ->greeting("Bonjour " . $notifiable->name)
            ->line("Un nouveau candidat a postulé à votre offre : " . $this->candidature->offreEmploi->titre)
            ->action('Voir la candidature', url('/employeur/candidatures')) // lien à adapter
            ->line("Merci d'utiliser notre plateforme.");
    }
}
