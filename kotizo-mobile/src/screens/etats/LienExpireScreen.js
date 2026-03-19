import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function LienExpireScreen({ navigation, route }) {
  const contexte = route.params?.contexte || 'cotisation';

  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🔗</Text>
      <Text style={styles.titre}>Lien expire</Text>
      <Text style={styles.sousTitre}>Ce lien ou QR code n'est plus valide</Text>
      {contexte === 'cotisation' && (
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate('Rejoindre')}
        >
          <Text style={styles.btnTexte}>Rechercher une cotisation</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.lienRetour} onPress={() => navigation.goBack()}>
        <Text style={styles.lienTexte}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icone: { fontSize: 64, marginBottom: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, marginBottom: 32, textAlign: 'center' },
  btnAction: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginBottom: 12,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  lienRetour: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 14 },
});