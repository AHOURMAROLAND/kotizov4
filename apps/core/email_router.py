import smtplib
import requests
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def envoyer_email(destinataire, sujet, contenu_html, contenu_texte=None):
    # essaie chaque provider dans l'ordre jusqu'au succes
    providers = [
        _envoyer_gmail,
        _envoyer_brevo,
        _envoyer_mailjet,
        _envoyer_resend,
    ]

    for provider in providers:
        try:
            succes = provider(destinataire, sujet, contenu_html, contenu_texte)
            if succes:
                return True
        except Exception:
            continue

    return False


def _envoyer_gmail(destinataire, sujet, contenu_html, contenu_texte):
    user = os.getenv('GMAIL_USER')
    password = os.getenv('GMAIL_PASSWORD')

    if not user or not password:
        return False

    msg = MIMEMultipart('alternative')
    msg['Subject'] = sujet
    msg['From'] = user
    msg['To'] = destinataire

    if contenu_texte:
        msg.attach(MIMEText(contenu_texte, 'plain'))
    msg.attach(MIMEText(contenu_html, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(user, password)
        server.sendmail(user, destinataire, msg.as_string())

    return True


def _envoyer_brevo(destinataire, sujet, contenu_html, contenu_texte):
    api_key = os.getenv('BREVO_API_KEY')
    if not api_key:
        return False

    response = requests.post(
        'https://api.brevo.com/v3/smtp/email',
        headers={'api-key': api_key, 'Content-Type': 'application/json'},
        json={
            'sender': {'email': 'noreply@kotizo.tg', 'name': 'Kotizo'},
            'to': [{'email': destinataire}],
            'subject': sujet,
            'htmlContent': contenu_html,
        }
    )
    return response.status_code == 201


def _envoyer_mailjet(destinataire, sujet, contenu_html, contenu_texte):
    api_key = os.getenv('MAILJET_API_KEY')
    secret = os.getenv('MAILJET_API_SECRET')
    if not api_key or not secret:
        return False

    response = requests.post(
        'https://api.mailjet.com/v3.1/send',
        auth=(api_key, secret),
        json={
            'Messages': [{
                'From': {'Email': 'noreply@kotizo.tg', 'Name': 'Kotizo'},
                'To': [{'Email': destinataire}],
                'Subject': sujet,
                'HTMLPart': contenu_html,
            }]
        }
    )
    return response.status_code == 200


def _envoyer_resend(destinataire, sujet, contenu_html, contenu_texte):
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key:
        return False

    response = requests.post(
        'https://api.resend.com/emails',
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        json={
            'from': 'Kotizo <noreply@kotizo.tg>',
            'to': [destinataire],
            'subject': sujet,
            'html': contenu_html,
        }
    )
    return response.status_code == 200


# templates email
def template_verification(prenom, token):
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Bonjour {prenom},</h2>
        <p>Votre code de verification Kotizo est :</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;
                    padding:20px;background:#f5f5f5;border-radius:8px;margin:20px 0">
            {token}
        </div>
        <p>Ce code expire dans 5 minutes.</p>
        <p style="color:#999;font-size:12px">Si vous n'avez pas cree de compte Kotizo, ignorez cet email.</p>
    </div>
    """


def template_reset_password(prenom, token):
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Bonjour {prenom},</h2>
        <p>Votre code de reinitialisation de mot de passe est :</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;
                    padding:20px;background:#f5f5f5;border-radius:8px;margin:20px 0">
            {token}
        </div>
        <p>Ce code expire dans 5 minutes. Usage unique.</p>
        <p style="color:#999;font-size:12px">Si vous n'avez pas demande cette reinitialisation, 
        changez votre mot de passe immediatement.</p>
    </div>
    """


def template_alerte_securite(prenom, action):
    actions = {
        'changement_mot_de_passe': 'Votre mot de passe a ete modifie.',
        'reset_password': 'Votre mot de passe a ete reinitialise.',
        'blocage_compte': 'Votre compte a ete temporairement bloque suite a plusieurs tentatives de connexion.',
    }
    message = actions.get(action, 'Une action de securite a ete effectuee sur votre compte.')
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Alerte securite — Kotizo</h2>
        <p>Bonjour {prenom},</p>
        <p>{message}</p>
        <p>Si ce n'est pas vous, contactez-nous immediatement.</p>
    </div>
    """