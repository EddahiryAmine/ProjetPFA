<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Vérifiez votre adresse email</title>
    <style>
        @media only screen and (max-width: 600px) {
            .inner-body {
                width: 100% !important;
            }
            .footer {
                width: 100% !important;
            }
        }
        
        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
            }
        }
        
        /* Base */
        body, body *:not(html):not(style):not(br):not(tr):not(code) {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            position: relative;
        }
        
        body {
            -webkit-text-size-adjust: none;
            background-color: #f7fafc;
            color: #4a5568;
            height: 100%;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }
        
        /* Layout */
        .wrapper {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 100%;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        .content {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 100%;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        .header {
            padding: 25px 0;
            text-align: center;
        }
        
        .header a {
            color: #4f46e5;
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
        }
        
        .logo {
            height: 75px;
            width: auto;
            margin-bottom: 15px;
        }
        
        .body {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 100%;
            background-color: #f7fafc;
            border-bottom: 1px solid #f7fafc;
            border-top: 1px solid #f7fafc;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        .inner-body {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 570px;
            background-color: #ffffff;
            border-color: #e8e5ef;
            border-radius: 8px;
            border-width: 1px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            margin: 0 auto;
            padding: 0;
            width: 570px;
        }
        
        .main {
            border-radius: 8px;
            overflow: hidden;
        }
        
        .header-image {
            background-color: #4f46e5;
            padding: 30px 0;
            text-align: center;
        }
        
        .header-icon {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-block;
            padding: 18px;
            width: 64px;
            height: 64px;
        }
        
        .header-icon svg {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        
        .content-cell {
            max-width: 100vw;
            padding: 32px;
        }
        
        /* Typography */
        h1 {
            color: #3d4852;
            font-size: 22px;
            font-weight: bold;
            margin-top: 0;
            text-align: center;
        }
        
        p {
            font-size: 16px;
            line-height: 1.5em;
            margin-top: 0;
            text-align: left;
        }
        
        p.sub {
            font-size: 12px;
        }
        
        .steps {
            margin-top: 30px;
            margin-bottom: 30px;
        }
        
        .step {
            display: flex;
            margin-bottom: 15px;
        }
        
        .step-number {
            background-color: #eef2ff;
            border-radius: 50%;
            color: #4f46e5;
            display: inline-block;
            font-weight: bold;
            height: 26px;
            line-height: 26px;
            margin-right: 10px;
            text-align: center;
            width: 26px;
        }
        
        .greeting {
            margin-bottom: 10px;
        }
        
        .notification-box {
            background-color: #eef2ff;
            border-radius: 8px;
            color: #4338ca;
            margin-bottom: 30px;
            padding: 16px;
            text-align: center;
        }
        
        /* Buttons */
        .action {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 100%;
            margin: 30px auto;
            padding: 0;
            text-align: center;
            width: 100%;
        }
        
        .button {
            -webkit-text-size-adjust: none;
            border-radius: 6px;
            color: #fff;
            display: inline-block;
            font-weight: bold;
            overflow: hidden;
            position: relative;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .button-primary {
            background-color: #4f46e5;
            border-top: 12px solid #4f46e5;
            border-right: 24px solid #4f46e5;
            border-bottom: 12px solid #4f46e5;
            border-left: 24px solid #4f46e5;
        }
        
        .button-primary:hover {
            background-color: #4338ca;
            border-top: 12px solid #4338ca;
            border-right: 24px solid #4338ca;
            border-bottom: 12px solid #4338ca;
            border-left: 24px solid #4338ca;
        }
        
        /* Footer */
        .footer {
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            -premailer-width: 570px;
            margin: 0 auto;
            padding: 0;
            text-align: center;
            width: 570px;
        }
        
        .footer p {
            color: #a0aec0;
            font-size: 12px;
            text-align: center;
        }
        
        .footer a {
            color: #a0aec0;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <a href="{{ url('/') }}" style="display: inline-block;">
                                <div style="font-size: 28px; font-weight: bold; color: #4f46e5;">
                                    <span style="color: #4f46e5;">job</span><span style="color: #3b82f6;">Portal</span>
                                </div>
                            </a>
                        </td>
                    </tr>

                    <!-- Email Body -->
                    <tr>
                        <td class="body" width="100%" cellpadding="0" cellspacing="0">
                            <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                                <!-- Body content -->
                                <tr>
                                    <td class="main">
                                        <div class="header-image">
                                            <div class="header-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                        <table class="content-cell" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td>
                                                    <h1>Vérifiez votre adresse email</h1>
                                                    <p class="greeting">Bonjour {{ $name }},</p>
                                                    
                                                    <div class="notification-box">
                                                        Merci de vous être inscrit sur jobPortal. Pour finaliser votre inscription, veuillez confirmer votre adresse email.
                                                    </div>
                                                    
                                                    <div class="steps">
                                                        <div class="step">
                                                            <div class="step-number">1</div>
                                                            <div>Cliquez sur le bouton ci-dessous pour vérifier votre email</div>
                                                        </div>
                                                        <div class="step">
                                                            <div class="step-number">2</div>
                                                            <div>Vous serez redirigé vers notre plateforme</div>
                                                        </div>
                                                        <div class="step">
                                                            <div class="step-number">3</div>
                                                            <div>Vous pourrez maintenant vous connecter et utiliser jobPortal</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <!-- Action Button -->
                                                    <table class="action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                                        <tr>
                                                            <td align="center">
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                    <tr>
                                                                        <td align="center">
                                                                            <a href="{{ $verificationUrl }}" class="button button-primary" target="_blank" rel="noopener">Confirmer mon adresse email</a>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <p>Si vous n'avez pas créé de compte sur jobPortal, aucune action n'est requise.</p>
                                                    <p>Si vous rencontrez des difficultés avec le bouton ci-dessus, copiez et collez l'URL suivante dans votre navigateur :</p>
                                                    <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all;">
                                                        {{ $verificationUrl }}
                                                    </p>
                                                    
                                                    <p>Merci,<br>L'équipe jobPortal</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td>
                            <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td align="center">
                                        <p>© {{ date('Y') }} jobPortal. Tous droits réservés.</p>
                                        <p>Si vous avez des questions, contactez-nous à <a href="mailto:support@jobportal.com">support@jobportal.com</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>