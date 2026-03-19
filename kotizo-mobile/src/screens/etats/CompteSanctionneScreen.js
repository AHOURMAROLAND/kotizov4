import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CompteSanctionneScreen({ navigation, route }) {
  const { type, motif, dateFin } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>🛡</Text>
      </View>
      <Text style={styles.titre}>Compte sanctionne</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Type</Text>
        <Text style={styles.infoValeur}>{type || 'Suspension'}</Text>
        <Text style={styles.infoLabel}>Motif</Text>
        <Text style={styles.infoValeur}>{motif || 'Non specifie'}</Text>
        {dateFin && (
          <>
            <Text style={styles.infoLabel}>Fin de sanction</Text>
            <Text style={styles.infoValeur}>{dateFin}</Text>
          </>
        )}
      </View>
      <TouchableOpacity
        style={styles.btnContester}
        onPress={() => navigation.navigate('AgentIA')}
      >
        <Text style={styles.btnTexte}>Contester via le support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24, alignItems: 'center', justifyContent: 'center' },
  iconeContainer: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  icone: { fontSize: 44 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 24 },
  infoCard: { backgroundColor: Colors.greyLight, borderRadius: 16, padding: 16, width: '100%', marginBottom: 32, gap: 4 },
  infoLabel: { fontSize: 12, color: Colors.grey },
  infoValeur: { fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 8 },
  btnContester: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});