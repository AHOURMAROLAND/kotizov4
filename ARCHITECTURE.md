# Kotizo v4 — Architecture du projet

## Stack technique
- **Mobile** : React Native + Expo SDK 55
- **Backend** : Django 5 + DRF + Celery + Redis
- **Admin web** : React.js + Tailwind CSS
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Stockage fichiers** : Cloudinary
- **Paiements** : PayDunya (Mixx by Yas, Moov Money, T-Money)
- **WhatsApp** : Evolution API (Docker)
- **Agent IA** : Google Gemini 2.0 Flash
- **Notifications push** : Firebase FCM

## Structure des dossiers
```
kotizov4/
├── apps/
│   ├── users/          # Auth, profils, niveaux, tokens
│   ├── cotisations/    # Cotisations, participations, commentaires, reçus
│   ├── paiements/      # Transactions PayDunya, QuickPay, remboursements
│   ├── notifications/  # Notifications in-app, WhatsApp, email
│   ├── agent_ia/       # Agent Gemini, messages, limites
│   ├── admin_panel/    # Dashboard admin, rôles, config WhatsApp
│   ├── core/           # Email router, WhatsApp client, utilitaires
│   └── logs/           # State logs, alertes fraude, sanctions
├── config/
│   ├── settings/
│   │   ├── base.py     # Config commune
│   │   ├── dev.py      # SQLite, debug=True
│   │   └── prod.py     # PostgreSQL, SSL
│   ├── urls.py
│   ├── celery.py
│   ├── wsgi.py
│   └── asgi.py
├── kotizo-mobile/      # React Native Expo
├── kotizo-admin/       # React.js + Tailwind
├── docker/
├── docs/
├── docker-compose.yml  # Redis + Evolution API
├── manage.py
├── .env
└── requirements.txt
```

## URLs backend
- `api.kotizo.app` → Django REST API
- `admin.kotizo.app` → Dashboard admin React
- `kotizo.app` → App mobile

## Apps et responsabilités

### users
- Modèle User custom (email + WhatsApp)
- Auth JWT (access 30min, refresh 7j)
- Double vérification canal (WhatsApp ou Email)
- Niveaux : Basique (gratuit) / Vérifié (1000 FCFA)
- Biométrie après 1ère connexion
- Suppression comptes non vérifiés après 48h

### cotisations
- Création et gestion des cotisations collectives
- Participations et suivi des paiements
- **Commentaires** : débloqués 7 jours après paiement confirmé
- **Reçus** : image JPG compressée (Pillow) → Cloudinary + envoi WhatsApp

### paiements
- Intégration PayDunya (Mixx by Yas, Moov Money, T-Money)
- IPN webhook : `request.POST` (application/x-www-form-urlencoded)
- QuickPay : virement direct sans PIN payeur
- Remboursements semi-automatiques

### notifications
- Chaîne email : Gmail → Brevo → Mailjet → Resend
- WhatsApp via Evolution API (délai 3-6s aléatoire, warm-up)
- Notifications in-app + push Firebase FCM

### agent_ia
- Agent Gemini 2.0 Flash (lecture seule)
- Mémoire session jour
- Limites : 3 msgs/j (basic), 25 msgs/j (verified)
- Censure périmètre Kotizo

### admin_panel
- 15 sections de gestion
- AW14 : Configuration WhatsApp à chaud
- AW15 : Paramètres généraux modifiables sans code
- Rôles et permissions granulaires

### core
- `email_router.py` : fallback Gmail → Brevo → Mailjet → Resend
- `whatsapp.py` : client Evolution API avec délai aléatoire

### logs
- State logs toutes les actions critiques
- Alertes fraude (signalements, suspension auto)
- Sanctions utilisateurs

## Règles de développement
- Pas d'emoji dans le code ni l'UI
- Commentaires minimalistes
- Commandes PowerShell compatibles
- Git commit après chaque bloc
- Pourcentage d'avancement affiché