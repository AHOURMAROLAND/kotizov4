import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../utils/colors';

export default function ConfirmationPaiementScreen({ navigation, route }) {
  const { montant, cotisation, operateur, recuUrl } = route.params || {};

  const operateursNoms = { mixx: 'Mixx by Yas', moov: 'Moov Money', tmoney: 'T-Money' };

  return (
    <View style={styles.container}>
      <View style={styles.animation}>
        <Text style={styles.emoji}>✅</Text>
      </View>

      <Text style={styles.titre}>Paiement confirme</Text>

      <View style={styles.recapCard}>
        <View style={styles.ligne}>
          <Text style={styles.ligneLabel}>Montant</Text>
          <Text style={styles.ligneValeur}>{montant} FCFA</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.ligneLabel}>Cotisation</Text>
          <Text style={styles.ligneValeur}>{cotisation?.titre}</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.ligneLabel}>Operateur</Text>
          <Text style={styles.ligneValeur}>{operateursNoms[operateur] || operateur}</Text>
        </View>
      </View>

      {recuUrl && (
        <View style={styles.recuBox}>
          <Text style={styles.recuTexte}>Recu envoye sur WhatsApp</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnRetour}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.btnRetourTexte}>Retour a l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center',
  },
  animation: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#DCFCE7', alignItems: 'center',
    justifyContent: 'center', marginBottom: 24,
  },
  emoji: { fontSize: 48 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 24 },
  recapCard: {
    backgroundColor: Colors.greyLight, borderRadius: 16,
    padding: 16, width: '100%', marginBottom: 16,
  },
  ligne: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  ligneLabel: { fontSize: 14, color: Colors.grey },
  ligneValeur: { fontSize: 14, fontWeight: '600', color: Colors.black },
  recuBox: {
    backgroundColor: '#DCFCE7', borderRadius: 12,
    padding: 12, marginBottom: 24, width: '100%', alignItems: 'center',
  },
  recuTexte: { color: Colors.success, fontSize: 14, fontWeight: '600' },
  actions: { width: '100%' },
  btnRetour: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnRetourTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});