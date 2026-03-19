import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function BusinessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🏢</Text>
      <Text style={styles.titre}>Compte Business</Text>
      <Text style={styles.sousTitre}>Bientot disponible</Text>
      <View style={styles.features}>
        {[
          'Cotisations illimitees',
          'Messages IA illimites',
          'Dashboard analytique',
          'Support prioritaire',
        ].map(f => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureTexte}>{f}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnTexte}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  icone: { fontSize: 64 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black },
  sousTitre: { fontSize: 16, color: Colors.grey },
  features: { width: '100%', gap: 12, marginTop: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureCheck: { color: Colors.success, fontSize: 18, fontWeight: 'bold' },
  featureTexte: { fontSize: 15, color: Colors.black },
  btn: {
    borderWidth: 1.5, borderColor: Colors.primary,
    paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 16, marginTop: 16,
  },
  btnTexte: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
});