from django.core.cache import cache
from .models import QuickPay
from core.utils import generer_code


def generer_code_quickpay():
    while True:
        code = generer_code(6)
        if not QuickPay.objects.filter(code=code).exists():
            return code