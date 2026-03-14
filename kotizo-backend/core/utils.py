import random
import string
import hashlib


def generer_code(longueur=8, chars=None):
    if chars is None:
        chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=longueur))


def calculer_frais_kotizo(montant):
    montant = int(montant)
    if montant <= 5000:
        return 250
    if montant <= 10000:
        return 500
    return 1000


def detecter_operateur_togo(numero):
    numero = numero.replace('+228', '').replace(' ', '').strip()
    if numero.startswith(('9', '8')):
        return 'moov-togo'
    if numero.startswith('7'):
        return 't-money-togo'
    if numero.startswith('6'):
        return 'mixx-togo'
    return 'moov-togo'


def normaliser_numero(numero):
    numero = numero.strip().replace(' ', '')
    if not numero.startswith('+228'):
        if len(numero) == 8:
            numero = '+228' + numero
    return numero


def verifier_hash_paydunya(master_key):
    return hashlib.sha512(master_key.encode()).hexdigest()