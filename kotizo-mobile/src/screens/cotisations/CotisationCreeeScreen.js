import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CotisationCreeeScreen({ navigation, route }) {
  const { cotisation } = route.params;

  const partager = async () => {
    await Share.share({
      message: `Rejoignez ma cotisation "${cotisation.titre}" sur Kotizo ! Code : ${cotisation.slug}`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contenu}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.titre}>Cotisation creee !</Text>
        <Text style={styles.sousTitre}>{cotisation.titre}</Text>

        <View style={styles.slugBox}>
          <Text style={styles.slugLabel}>Code de la cotisation</Text>
          <Text style={styles.slug}>{cotisation.slug}</Text>
          <Text style={styles.slugInfo}>Partagez ce code pour inviter des membres</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPartager} onPress={partager}>
            <Text style={styles.btnPartagerTexte}>Partager le code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnVoir}
            onPress={() => navigation.replace('DetailCotisation', { slug: cotisation.slug })}
          >
            <Text style={styles.btnVoirTexte}>Voir la cotisation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.lienAccueil}
            onPress={() => navigation.replace('MainTabs')}
          >
            <Text style={styles.lienTexte}>Retour a l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  contenu: { alignItems: 'center', width: '100%' },
  emoji: { fontSize: 72, marginBottom: 16 },
  titre: { fontSize: 28, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 16, color: Colors.grey, marginBottom: 32 },
  slugBox: {
    backgroundColor: Colors.primaryLight, borderRadius: 20,
    padding: 24, alignItems: 'center', width: '100%', marginBottom: 32,
  },
  slugLabel: { fontSize: 13, color: Colors.grey, marginBottom: 8 },
  slug: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, letterSpacing: 4 },
  slugInfo: { fontSize: 12, color: Colors.grey, marginTop: 8, textAlign: 'center' },
  actions: { width: '100%', gap: 12 },
  btnPartager: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnPartagerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  btnVoir: {
    borderWidth: 1.5, borderColor: Colors.primary,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
  },
  btnVoirTexte: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
  lienAccueil: { alignItems: 'center', paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});