# Kotizo v4 — DIM (Dossier d'Interfaces Mobile)
# 56 interfaces — version 1.0 verrouillée

---

## FLUX A — ONBOARDING (6 écrans)

### A1 — Splash Screen
- Durée : 2 secondes
- Contenu : logo Kotizo centré, fond couleur primaire
- Transition : vers A2 si première ouverture, vers B1 si déjà connecté, vers écran principal si token valide

### A2 — Tutoriel 1/3
- Titre : "Cotisez ensemble"
- Description : créez et rejoignez des cotisations collectives en quelques secondes
- Illustration : animation Lottie cotisation
- Actions : Suivant, Passer (skip vers A5)
- Navigation : swipe gauche vers A3

### A3 — Tutoriel 2/3
- Titre : "Payez facilement"
- Description : Mixx by Yas, Moov Money, T-Money — tous les opérateurs Togo
- Illustration : animation Lottie paiement mobile
- Actions : Suivant, Passer
- Navigation : swipe gauche vers A4, swipe droite vers A2

### A4 — Tutoriel 3/3
- Titre : "Suivez en temps réel"
- Description : notifications WhatsApp, reçus automatiques, historique complet
- Illustration : animation Lottie notification
- Actions : Commencer, Retour
- Navigation : Commencer → A5

### A5 — Conditions Générales d'Utilisation
- Contenu : CGU scrollable
- Bouton "Accepter et continuer" : inactif jusqu'au scroll complet
- Lien "Politique de confidentialité" → A6
- Action : Accepter → B1

### A6 — Politique de Confidentialité
- Contenu : politique scrollable
- Bouton Retour vers A5

---

## FLUX B — AUTHENTIFICATION (10 écrans)

### B1 — Connexion
- Champs : email, mot de passe
- Actions : Se connecter, Mot de passe oublié → B4, Créer un compte → B2
- Bouton biométrie : visible si biométrie activée → B9
- États : chargement (spinner), erreur inline, compte bloqué → B6
- Règles : message générique "identifiants incorrects" sur 1-4 échecs
- Après 5 échecs : blocage 30 min → B6

### B2 — Inscription
- Champs : prénom, nom, email, téléphone WhatsApp (+228...), mot de passe, confirmation
- Validation inline : format email, format téléphone, force mot de passe
- Action : Créer mon compte → B3a
- Lien : Déjà un compte → B1

### B3a — Choix du canal de vérification
- Titre : "Vérifiez votre compte"
- Option 1 : WhatsApp (recommandé) — affiche le numéro saisi
- Option 2 : Email — affiche l'email saisi
- Description : "Le premier canal validé active votre compte"
- Action : Confirmer le choix → B3b

### B3b — Vérification en cours
- Loader animé (arc ou pulse)
- Message selon canal choisi :
  - WhatsApp : "Ouvrez WhatsApp et envoyez le message pré-rempli"
  - Email : "Vérifiez votre boîte mail — lien valable 5 minutes"
- Bouton : Renvoyer le code (actif après 60 secondes)
- Bouton : Changer de canal
- Timer compte à rebours 5 minutes visible
- Succès → écran principal (C1)

### B4 — Mot de passe oublié
- Champ : email
- Canal : choix Email ou WhatsApp OTP
- WhatsApp visible uniquement si numéro enregistré
- Action : Envoyer le code → B5
- Lien : Retour → B1

### B5 — Réinitialisation mot de passe
- Champ : code OTP 6 caractères (clavier numérique)
- Champs : nouveau mot de passe, confirmation
- Timer 5 minutes visible
- Action : Réinitialiser → B1 avec message succès
- Erreur : code invalide ou expiré (affichage inline)

### B6 — Compte bloqué
- Icône cadenas
- Message : "Compte temporairement bloqué"
- Durée restante affichée (countdown)
- Explication : trop de tentatives de connexion
- Bouton : Contacter le support → H1
- Bouton : Retour → B1

### B7 — Reconfirmation mot de passe (modal réutilisable)
- Déclenché avant toute action sensible (changer email, supprimer compte, etc.)
- Champ : mot de passe actuel
- Actions : Confirmer, Annuler
- Utilisé dans : F3, F4, F13

### B8 — Activation biométrie
- Déclenché après première connexion réussie
- Titre : "Activez la connexion rapide"
- Description : Face ID ou empreinte digitale
- Actions : Activer, Plus tard
- Activer → demande biométrie système → succès → écran principal

### B9 — Connexion biométrique
- Logo Kotizo centré
- Icône biométrie (empreinte ou visage selon appareil)
- Message : "Posez votre doigt ou regardez l'écran"
- Déclenchement automatique à l'ouverture
- Échec → B1 avec email pré-rempli
- Bouton : Utiliser mot de passe → B1

---

## FLUX C — COTISATIONS (14 écrans)

### C1 — Dashboard principal
- Header : avatar, prénom, niveau badge
- Bandeau orange si email non vérifié ou WhatsApp non vérifié
- Résumé : montant total cotisé, nombre cotisations actives
- Liste cotisations actives (scroll)
- Bouton flottant : créer cotisation → C3
- Bouton flottant IA : → H1
- Tab bar : Dashboard, QuickPay, Historique, Profil

### C2 — Mes cotisations
- Onglets : Créées / Participées
- Liste avec statut, montant, progression barre
- Tap sur cotisation → C6
- État vide : illustration + CTA créer

### C3 — Créer une cotisation
- Champs : titre (requis), description, montant cible (requis), montant par membre (requis)
- Optionnel : nombre membres max, date limite
- Validation inline
- Action : Aperçu → C4
- Vérification limite journalière avant soumission → C14 si atteinte

### C4 — Aperçu cotisation
- Récapitulatif complet avant création
- Actions : Confirmer → C5, Modifier → C3

### C5 — Cotisation créée
- Animation confetti
- Slug KTZ-XXXXXX affiché en grand
- QR code généré
- Actions : Partager (WhatsApp, copier lien), Voir la cotisation → C6

### C6 — Détail cotisation
- Infos : titre, slug, montant cible, montant collecté, progression
- Liste membres avec statut paiement (payé / en attente)
- Bouton Payer si participation en attente → C7
- Bouton Rejoindre si pas encore membre → C11
- Bouton Commentaires → liste commentaires (si autorisé)
- Bouton Signaler (si pas créateur)
- Menu créateur : Annuler cotisation, Partager

### C7 — Payer ma cotisation
- Montant affiché
- Sélection opérateur → C8
- Résumé avant paiement

### C8 — Choix opérateur paiement
- 3 boutons : Mixx by Yas, Moov Money, T-Money
- Champ numéro de téléphone (pré-rempli si WhatsApp enregistré)
- Action : Payer → C9

### C9 — Paiement en attente
- Loader Pulse animé
- Message : "Confirmez sur votre téléphone"
- Opérateur affiché
- Timeout 3 minutes avec countdown
- Timeout expiré → message erreur + bouton réessayer
- Succès webhook → C10

### C10 — Confirmation paiement
- Animation succès
- Montant, cotisation, opérateur
- Reçu disponible (bouton télécharger image)
- Message : "Reçu envoyé sur WhatsApp"
- Action : Retour cotisation → C6

### C11 — Rejoindre une cotisation
- Champ slug KTZ-XXXXXX ou scan QR
- Aperçu cotisation après recherche
- Actions : Rejoindre, Annuler
- Erreur lien expiré → G3

### C12 — Lien/QR expiré cotisation
- Réutilise G3

### C13 — Carte célébration
- Déclenchée quand objectif atteint (100%)
- Animation feux d'artifice
- Message personnalisé
- Partage possible

### C14 — Limite journalière atteinte
- Icône cadenas
- Message : "X cotisations créées aujourd'hui (limite : Y)"
- Explication niveau actuel
- CTA upgrade vers niveau Vérifié
- Bouton : Retour → C1

---

## FLUX D — QUICK PAY (6 écrans)

### D1 — Historique QuickPay
- Onglets : Envoyés / Reçus
- Liste avec statut (payé, en attente, expiré)
- Bouton créer → D2
- Tap sur item → détail

### D2 — Créer QuickPay
- Champ destinataire (email ou nom)
- Champ montant
- Champ message optionnel
- Action : Créer → D3

### D3 — QuickPay généré
- Montant et destinataire
- QR code
- Compte à rebours 1 heure
- Actions : Partager, Copier lien
- Expiré → D5

### D4 — Paiement QuickPay en attente
- Même que C9 (loader Pulse, countdown 3 min)
- Succès → D6

### D5 — QuickPay expiré
- Icône horloge
- Message expiré
- Actions : Recréer, Retour → D1

### D6 — Confirmation réception QuickPay
- Animation succès
- Montant reçu, expéditeur
- Reçu disponible
- Retour → D1

---

## FLUX E — HISTORIQUE (5 écrans)

### E1 — Cotisations créées
- Liste avec filtres (active, terminée, annulée)
- Tap → C6

### E2 — Cotisations participées
- Liste avec statut paiement
- Tap → C6

### E3 — QuickPay envoyés
- Liste chronologique
- Tap → détail

### E4 — QuickPay reçus
- Liste chronologique
- Tap → détail

### E5 — Détail transaction
- Infos complètes : montant, date, opérateur, statut
- Reçu exportable (télécharger image JPG, partager)
- Bouton demander remboursement si éligible

---

## FLUX F — PROFIL (14 écrans)

### F1 — Profil principal
- Avatar, nom, prénom, niveau badge
- Stats : cotisations créées, participées, montant total
- Toggle thème clair/sombre
- Menu : Modifier profil, Notifications, Sécurité, Vérification, Déconnexion

### F2 — Modifier profil
- Champs : prénom, nom (email et WA non modifiables ici)
- Photo de profil (Cloudinary)
- Action : Sauvegarder

### F3 — Changer email
- Reconfirmation mot de passe → B7
- Champ nouvel email
- Envoi code vérification → confirmation

### F4 — Changer numéro WhatsApp
- Reconfirmation mot de passe → B7
- Champ nouveau numéro
- Deep link vers ancien numéro pour confirmation
- Message STOP annule en 5 min
- Puis deep link vers nouveau numéro

### F5 — Vérification CNI recto
- Camera overlay
- Guide cadrage
- Bouton capturer
- Aperçu + confirmer ou reprendre

### F6 — Vérification CNI verso
- Même que F5

### F7 — Liveness (selfie vidéo)
- Instructions : regarder la caméra, tourner la tête
- Enregistrement 5 secondes
- Upload Cloudinary dossier privé

### F8 — En attente validation
- Illustration sablier
- Message : "Vérification en cours (sous 24h)"
- Bouton retour profil

### F9 — Vérification approuvée + paiement
- Animation succès
- Message : "Compte vérifié ! Finalisez avec le paiement de 1000 FCFA"
- Bouton payer → flux paiement 1000 FCFA

### F10 — Centre notifications
- Toggle par type : paiements, rappels, système
- Toggle WhatsApp / Email / Push

### F11 — Paramètres généraux
- Langue (français uniquement v1)
- Thème clair/sombre
- Biométrie toggle
- Version app

### F12a — Sécurité
- Changer mot de passe
- Sessions actives → F12b
- Historique connexions

### F12b — Sessions actives
- Liste appareils connectés
- Bouton déconnecter session individuelle
- Bouton déconnecter partout

### F13 — Supprimer compte
- Reconfirmation mot de passe → B7
- Avertissement : impossible si cotisations actives
- Confirmation texte à saisir
- Action irréversible

### F14 — Business (placeholder v2)
- Illustration
- Message : "Bientôt disponible"
- Description fonctionnalités Business

---

## FLUX G — ÉTATS SPÉCIAUX (6 écrans)

### G1 — Mode hors ligne
- Banner rouge en haut
- Données cached AsyncStorage affichées
- Message : "Mode hors ligne — données peuvent être obsolètes"
- Fonctions désactivées : paiement, création cotisation

### G2 — Erreur réseau
- Illustration réseau coupé
- Bouton réessayer
- Bouton mode hors ligne → G1

### G3 — Lien / QR expiré (réutilisé par C12 et D5)
- Icône lien cassé
- Message : "Ce lien a expiré"
- Actions selon contexte : Rechercher cotisation, Retour

### G4 — Cotisation introuvable (404)
- Illustration
- Message : "Cette cotisation n'existe pas ou a été supprimée"
- Bouton retour

### G5 — Maintenance
- Illustration outil
- Message maintenance avec durée estimée si disponible
- Pas d'action possible

### G6 — Compte sanctionné
- Icône bouclier rouge
- Type de sanction, motif, durée restante
- Bouton contester → H1 (avec pièce jointe possible)
- Bouton déconnexion

---

## FLUX H — AGENT IA (3 écrans)

### H1 — Messagerie IA
- Interface chat
- Suggestions rapides en chips (Créer une cotisation, Voir mon solde, Aide paiement)
- Icône trombone : joindre image pour réclamation
- Icône micro → H2
- Limite affichée : X/Y messages aujourd'hui
- Limite atteinte → H3
- Bouton flottant accessible depuis tous les écrans

### H2 — Micro dictée
- Loader Barres animé
- Transcription en temps réel
- Bouton arrêter
- Résultat envoyé vers H1

### H3 — Limite IA atteinte
- Modal
- Message : "X messages utilisés aujourd'hui"
- CTA upgrade si niveau Basique
- Retour disponible demain (heure reset)

---

## RÉSUMÉ DES 56 INTERFACES

| Flux | Écrans | Description |
|------|--------|-------------|
| A — Onboarding | A1 à A6 | 6 écrans |
| B — Auth | B1 à B9 (+ B7 modal) | 10 écrans |
| C — Cotisations | C1 à C14 | 14 écrans |
| D — QuickPay | D1 à D6 | 6 écrans |
| E — Historique | E1 à E5 | 5 écrans |
| F — Profil | F1 à F14 | 14 écrans |
| G — États spéciaux | G1 à G6 | 6 écrans |
| H — Agent IA | H1 à H3 | 3 écrans |
| **Total** | | **56 écrans** |

---

## RÈGLES COMMUNES À TOUS LES ÉCRANS

- Pas d'emoji dans l'UI
- Loader skeleton sur chargement initial
- Message d'erreur inline (pas de popup intrusif)
- Bouton retour toujours présent sauf écran principal
- Thème clair/sombre supporté
- Fonts : système iOS/Android
- Couleur primaire : vert Kotizo
- Toutes les actions sensibles passent par B7 (reconfirmation mot de passe)
- State logger appelé sur chaque action critique