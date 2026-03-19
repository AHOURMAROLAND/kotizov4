import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function QuickPayExpireScreen({ navigation, route }) {
  const { quickpay } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.icone}>⏱</Text>
      <Text style={styles.titre}>QuickPay expire</Text>
      <Text style={styles.sousTitre}>
        Ce QuickPay de {quickpay?.montant} FCFA a expire
      </Text>

      <TouchableOpacity
        style={styles.btnRecreer}
        onPress={() => navigation.replace('CreerQuickPay')}
      >
        <Text style={styles.btnTexte}>Creer un nouveau QuickPay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.lienRetour}
        onPress={() => navigation.replace('QuickPay')}
      >
        <Text style={styles.lienTexte}>Retour a l'historique</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center',
  },
  icone: { fontSize: 64, marginBottom: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, marginBottom: 40, textAlign: 'center' },
  btnRecreer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    paddingHorizontal: 32, borderRadius: 16, marginBottom: 12,
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienRetour: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});