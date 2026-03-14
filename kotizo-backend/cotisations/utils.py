from django.core.cache import cache
from .models import Cotisation
from core.utils import generer_code


def generer_slug():
    while True:
        slug = 'KTZ-' + generer_code(6)
        if not Cotisation.objects.filter(slug=slug).exists():
            return slug


def get_cotisations_actives_cache(user_id):
    cache_key = f'cotisations_actives_{user_id}'
    data = cache.get(cache_key)
    return data


def set_cotisations_actives_cache(user_id, data):
    cache_key = f'cotisations_actives_{user_id}'
    cache.set(cache_key, data, 300)


def invalider_cache_cotisations(user_id):
    cache_key = f'cotisations_actives_{user_id}'
    cache.delete(cache_key)