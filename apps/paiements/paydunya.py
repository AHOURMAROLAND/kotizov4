import requests
import os
import hashlib


def _get_headers():
    return {
        'PAYDUNYA-MASTER-KEY': os.getenv('PAYDUNYA_MASTER_KEY', ''),
        'PAYDUNYA-PRIVATE-KEY': os.getenv('PAYDUNYA_PRIVATE_KEY', ''),
        'PAYDUNYA-TOKEN': os.getenv('PAYDUNYA_TOKEN', ''),
        'Content-Type': 'application/json',
    }


def _get_base_url():
    mode = os.getenv('PAYDUNYA_MODE', 'test')
    if mode == 'live':
        return 'https://app.paydunya.com/api/v1'
    return 'https://app.paydunya.com/sandbox-api/v1'


def creer_invoice(montant, telephone, operateur, description, reference_interne):
    # creer une invoice PayDunya
    payload = {
        'invoice': {
            'total_amount': int(montant),
            'description': description,
        },
        'store': {
            'name': 'Kotizo',
        },
        'actions': {
            'cancel_url': 'https://kotizo.app/paiement/annule',
            'return_url': 'https://kotizo.app/paiement/retour',
            'callback_url': 'https://api.kotizo.app/api/paiements/webhook/',
        },
        'custom_data': {
            'reference_interne': reference_interne,
            'telephone': telephone,
            'operateur': operateur,
        },
        'channels': operateur,
    }

    try:
        response = requests.post(
            f"{_get_base_url()}/checkout-invoice/create",
            headers=_get_headers(),
            json=payload,
            timeout=15
        )
        data = response.json()
        if data.get('response_code') == '00':
            return {
                'succes': True,
                'token': data.get('token'),
                'url': data.get('response_text'),
            }
        return {'succes': False, 'erreur': data.get('response_text', 'Erreur PayDunya')}
    except Exception as e:
        return {'succes': False, 'erreur': str(e)}


def verifier_hash_webhook(request_post):
    # verification hash IPN PayDunya - utiliser request.POST jamais json.loads
    hash_recu = request_post.get('hash', '')
    master_key = os.getenv('PAYDUNYA_MASTER_KEY', '')
    hash_calcule = hashlib.sha512(master_key.encode()).hexdigest()
    return hash_recu == hash_calcule


def initier_paiement_mobile(montant, telephone, operateur, description, reference_interne):
    # paiement direct mobile money sans redirection
    operateurs_map = {
        'mixx': 'MIXX_BY_YAS_TOGO',
        'moov': 'MOOV_TOGO',
        'tmoney': 'T_MONEY',
    }

    payload = {
        'invoice': {
            'total_amount': int(montant),
            'description': description,
        },
        'store': {'name': 'Kotizo'},
        'actions': {
            'callback_url': 'https://api.kotizo.app/api/paiements/webhook/',
        },
        'customer': {
            'phone': telephone,
        },
        'channels': operateurs_map.get(operateur, operateur),
        'custom_data': {
            'reference_interne': reference_interne,
        },
    }

    try:
        response = requests.post(
            f"{_get_base_url()}/softpay/create",
            headers=_get_headers(),
            json=payload,
            timeout=15
        )
        data = response.json()
        if data.get('response_code') == '00':
            return {'succes': True, 'token': data.get('token')}
        return {'succes': False, 'erreur': data.get('response_text', 'Erreur PayDunya')}
    except Exception as e:
        return {'succes': False, 'erreur': str(e)}