import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function LimiteIAScreen({ navigation, route }) {
  const { count, limite } = route.params || { count: 3, limite: 3 };

  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🤖</Text>
      <Text style={styles.titre}>Limite atteinte</Text>
      <Text style={styles.sousTitre}>
        {count} messages utilises aujourd'hui{'\n'}(limite : {limite} par jour)
      </Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitre}>Passez au niveau Verifie</Text>
        <Text style={styles.infoTexte}>25 messages IA par jour avec un compte Verifie</Text>
        <TouchableOpacity
          style={styles.btnUpgrade}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.btnUpgradeTexte}>Verifier mon compte</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.reset}>Renouvellement demain a minuit</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.retour}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24, alignItems: 'center', justifyContent: 'center' },
  icone: { fontSize: 64, marginBottom: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  infoCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 20,
    padding: 20, width: '100%', alignItems: 'center', marginBottom: 16,
  },
  infoTitre: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  infoTexte: { fontSize: 14, color: Colors.grey, textAlign: 'center', marginBottom: 16 },
  btnUpgrade: {
    backgroundColor: Colors.primary, paddingVertical: 12,
    paddingHorizontal: 24, borderRadius: 12,
  },
  btnUpgradeTexte: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
  reset: { fontSize: 13, color: Colors.grey, marginBottom: 16 },
  retour: { color: Colors.primary, fontSize: 15 },
});