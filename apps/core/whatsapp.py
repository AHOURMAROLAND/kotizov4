import requests
import os
import time
import random


def _get_config():
    return {
        'url': os.getenv('EVOLUTION_API_URL', 'http://localhost:8080'),
        'key': os.getenv('EVOLUTION_API_KEY', ''),
        'instance': os.getenv('EVOLUTION_INSTANCE', 'kotizo'),
    }


def envoyer_message(numero, message):
    # delai aleatoire anti-ban 3-6 secondes
    time.sleep(random.uniform(3, 6))

    config = _get_config()
    try:
        response = requests.post(
            f"{config['url']}/message/sendText/{config['instance']}",
            headers={
                'apikey': config['key'],
                'Content-Type': 'application/json'
            },
            json={
                'number': numero,
                'text': message
            },
            timeout=10
        )
        return response.status_code == 201
    except Exception:
        return False


def envoyer_otp(numero, prenom, token, type_token='verification'):
    if type_token == 'verification':
        message = (
            f"Bonjour {prenom},\n\n"
            f"Votre code de verification Kotizo : *{token}*\n\n"
            f"Ce code expire dans 5 minutes."
        )
    elif type_token == 'reset_password':
        message = (
            f"Bonjour {prenom},\n\n"
            f"Votre code de reinitialisation de mot de passe : *{token}*\n\n"
            f"Ce code expire dans 5 minutes. Usage unique.\n"
            f"Si ce n'est pas vous, ignorez ce message."
        )
    elif type_token == 'connexion_magique':
        message = (
            f"Bonjour {prenom},\n\n"
            f"Votre lien de connexion Kotizo :\n"
            f"https://kotizo.app/connexion-magique?token={token}\n\n"
            f"Ce lien expire dans 5 minutes."
        )
    else:
        message = f"Votre code Kotizo : *{token}*"

    return envoyer_message(numero, message)


def envoyer_alerte_securite(numero, prenom, action):
    actions = {
        'changement_mot_de_passe': 'Votre mot de passe Kotizo a ete modifie.',
        'reset_password': 'Votre mot de passe Kotizo a ete reinitialise.',
        'blocage_compte': 'Votre compte Kotizo a ete temporairement bloque.',
    }
    texte = actions.get(action, 'Une action de securite a ete effectuee.')
    message = (
        f"Alerte securite Kotizo\n\n"
        f"Bonjour {prenom},\n"
        f"{texte}\n\n"
        f"Si ce n'est pas vous, contactez-nous immediatement."
    )
    return envoyer_message(numero, message)


def envoyer_recu(numero, prenom, titre_cotisation, montant, recu_url):
    message = (
        f"Bonjour {prenom},\n\n"
        f"Votre paiement de *{montant} FCFA* pour la cotisation "
        f"*{titre_cotisation}* a ete confirme.\n\n"
        f"Votre recu : {recu_url}"
    )
    return envoyer_message(numero, message)


def verifier_statut():
    # ping Evolution API — retourne True si connecte
    config = _get_config()
    try:
        response = requests.get(
            f"{config['url']}/instance/fetchInstances",
            headers={'apikey': config['key']},
            timeout=5
        )
        return response.status_code == 200
    except Exception:
        return False