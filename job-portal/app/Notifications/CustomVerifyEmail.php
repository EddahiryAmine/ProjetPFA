<?php
namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmail extends VerifyEmail
{
    public function toMail($notifiable)
    {
        // Générer l'URL de vérification de l'email
        $verificationUrl = $this->verificationUrl($notifiable);

        // Retourner un email avec un contenu HTML
        return (new MailMessage)
            ->subject('Vérifiez votre adresse email')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Merci de vous être inscrit. Veuillez confirmer votre adresse email.')
            ->line('Si vous n’avez pas créé de compte, aucune action n’est requise.')
            // Inclure le design HTML dans le corps du message
            ->markdown('emails.verify_email', ['name' => $notifiable->name, 'verificationUrl' => $verificationUrl]);
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify', 
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
