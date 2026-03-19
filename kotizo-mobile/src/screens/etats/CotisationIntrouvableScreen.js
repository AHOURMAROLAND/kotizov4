import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CotisationIntrouvableScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🔍</Text>
      <Text style={styles.titre}>Cotisation introuvable</Text>
      <Text style={styles.sousTitre}>
        Cette cotisation n'existe pas ou a ete supprimee
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Rejoindre')}>
        <Text style={styles.btnTexte}>Rechercher une cotisation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lien} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.lienTexte}>Retour a l'accueil</Text>
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
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22 },
  btn: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  lien: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 14 },
});