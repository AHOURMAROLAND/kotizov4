import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function HorsLigneScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTexte}>Mode hors ligne — donnees peuvent etre obsoletes</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.icone}>📡</Text>
        <Text style={styles.titre}>Pas de connexion</Text>
        <Text style={styles.sousTitre}>
          Les paiements et creations sont desactives hors ligne
        </Text>
        <TouchableOpacity style={styles.btnReessayer} onPress={() => navigation.goBack()}>
          <Text style={styles.btnTexte}>Reessayer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  banner: { backgroundColor: Colors.error, paddingVertical: 10, paddingHorizontal: 16 },
  bannerTexte: { color: Colors.white, fontSize: 13, textAlign: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  icone: { fontSize: 64 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22 },
  btnReessayer: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginTop: 8,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});