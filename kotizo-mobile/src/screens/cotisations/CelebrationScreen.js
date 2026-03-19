import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CelebrationScreen({ navigation, route }) {
  const { cotisation } = route.params || {};

  const partager = async () => {
    await Share.share({
      message: `Notre cotisation "${cotisation?.titre}" a atteint son objectif sur Kotizo !`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.confetti}>🎊</Text>
      <Text style={styles.titre}>Objectif atteint !</Text>
      <Text style={styles.sousTitre}>
        La cotisation {cotisation?.titre} a atteint 100% de son objectif
      </Text>
      <Text style={styles.montant}>{cotisation?.montant_cible} FCFA</Text>

      <TouchableOpacity style={styles.btnPartager} onPress={partager}>
        <Text style={styles.btnPartagerTexte}>Partager la nouvelle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.lienRetour}
        onPress={() => navigation.navigate('Dashboard')}
      >
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
  confetti: { fontSize: 80 },
  titre: { fontSize: 28, fontWeight: 'bold', color: Colors.black },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22 },
  montant: { fontSize: 32, fontWeight: 'bold', color: Colors.success },
  btnPartager: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginTop: 8,
  },
  btnPartagerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienRetour: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});