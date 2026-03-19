import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function QuickPayConfirmationScreen({ navigation, route }) {
  const { quickpay } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.animation}>
        <Text style={styles.emoji}>💸</Text>
      </View>
      <Text style={styles.titre}>Paiement recu !</Text>
      <Text style={styles.montant}>{quickpay?.montant} FCFA</Text>
      <Text style={styles.expediteur}>
        Recu de {quickpay?.expediteur?.prenom} {quickpay?.expediteur?.nom}
      </Text>
      {quickpay?.message ? (
        <Text style={styles.message}>{quickpay.message}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.btnRetour}
        onPress={() => navigation.replace('QuickPay')}
      >
        <Text style={styles.btnTexte}>Retour a l'historique</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  animation: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 48 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black },
  montant: { fontSize: 36, fontWeight: 'bold', color: Colors.success },
  expediteur: { fontSize: 15, color: Colors.grey },
  message: { fontSize: 14, color: Colors.grey, fontStyle: 'italic' },
  btnRetour: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginTop: 16,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});