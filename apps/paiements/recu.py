from PIL import Image, ImageDraw, ImageFont
import io
import os
from django.utils import timezone


def generer_recu_image(participation):
    # genere un recu JPG compresse pour Cloudinary
    largeur, hauteur = 800, 500
    img = Image.new('RGB', (largeur, hauteur), color='#ffffff')
    draw = ImageDraw.Draw(img)

    # couleurs
    vert = '#22c55e'
    gris = '#6b7280'
    noir = '#111827'

    # bande superieure verte
    draw.rectangle([0, 0, largeur, 80], fill=vert)
    draw.text((largeur // 2, 40), 'KOTIZO', fill='white', anchor='mm')

    # titre
    draw.text((largeur // 2, 120), 'Recu de paiement', fill=noir, anchor='mm')

    # infos
    lignes = [
        ('Cotisation', participation.cotisation.titre),
        ('Montant', f"{participation.montant} FCFA"),
        ('Participant', f"{participation.membre.prenom} {participation.membre.nom}"),
        ('Date', participation.date_paiement.strftime('%d/%m/%Y %H:%M') if participation.date_paiement else '-'),
        ('Reference', participation.cotisation.slug),
        ('Statut', 'PAYE'),
    ]

    y = 180
    for label, valeur in lignes:
        draw.text((100, y), f"{label} :", fill=gris)
        draw.text((350, y), str(valeur), fill=noir)
        y += 45

    # pied de page
    draw.rectangle([0, hauteur - 50, largeur, hauteur], fill='#f3f4f6')
    draw.text((largeur // 2, hauteur - 25), 'kotizo.app', fill=gris, anchor='mm')

    # compression JPG
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=75, optimize=True)
    buffer.seek(0)
    return buffer


def uploader_recu_cloudinary(participation):
    import cloudinary.uploader

    buffer = generer_recu_image(participation)

    result = cloudinary.uploader.upload(
        buffer,
        folder='kotizo/recus',
        public_id=f"recu_{participation.cotisation.slug}_{participation.membre.id}",
        resource_type='image',
        format='jpg',
        transformation=[{'quality': 'auto', 'fetch_format': 'auto'}]
    )

    return result.get('secure_url')