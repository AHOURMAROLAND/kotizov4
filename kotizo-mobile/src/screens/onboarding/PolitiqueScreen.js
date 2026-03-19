import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

const POLITIQUE_TEXTE = `
POLITIQUE DE CONFIDENTIALITE — KOTIZO

1. DONNEES COLLECTEES
Nous collectons : nom, prenom, email, numero de telephone WhatsApp, photos CNI (niveau Verifie), historique des transactions.

2. UTILISATION DES DONNEES
Vos donnees sont utilisees pour : gerer votre compte, traiter les paiements, envoyer des notifications, verifier votre identite.

3. STOCKAGE
Les donnees sont stockees sur des serveurs securises. Les photos CNI sont stockees dans un dossier prive Cloudinary avec acces restreint.

4. PARTAGE
Nous ne vendons pas vos donnees. Elles sont partagees uniquement avec : PayDunya (paiements), Evolution API (WhatsApp), Google Gemini (IA).

5. CONSERVATION
Les comptes non verifies sont supprimes apres 48h. Les donnees de compte actif sont conservees tant que le compte existe.

6. VOS DROITS
Vous pouvez demander la suppression de votre compte et de vos donnees depuis Profil > Securite > Supprimer mon compte.

7. COOKIES
L'application mobile n'utilise pas de cookies.

8. CONTACT
Pour toute question : support@kotizo.tg
`;

export default function PolitiqueScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Politique de confidentialite</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.texte}>{POLITIQUE_TEXTE}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 20, fontWeight: 'bold', color: Colors.black },
  scroll: { padding: 24 },
  texte: { fontSize: 14, color: Colors.text, lineHeight: 22 },
});