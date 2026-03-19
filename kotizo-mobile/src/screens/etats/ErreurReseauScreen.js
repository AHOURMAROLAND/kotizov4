import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function ErreurReseauScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🔌</Text>
      <Text style={styles.titre}>Erreur reseau</Text>
      <Text style={styles.sousTitre}>Verifiez votre connexion internet</Text>
      <TouchableOpacity style={styles.btnReessayer} onPress={() => navigation.goBack()}>
        <Text style={styles.btnTexte}>Reessayer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lienHorsLigne} onPress={() => navigation.navigate('HorsLigne')}>
        <Text style={styles.lienTexte}>Mode hors ligne</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icone: { fontSize: 64, marginBottom: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, marginBottom: 32 },
  btnReessayer: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginBottom: 12,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  lienHorsLigne: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 14 },
});