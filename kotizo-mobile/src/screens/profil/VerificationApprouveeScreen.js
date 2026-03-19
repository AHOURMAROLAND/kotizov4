import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function VerificationApprouveeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🎉</Text>
      <Text style={styles.titre}>Compte verifie !</Text>
      <Text style={styles.sousTitre}>
        Finalisez votre verification en payant les 1000 FCFA
      </Text>
      <View style={styles.prixCard}>
        <Text style={styles.prix}>1 000 FCFA</Text>
        <Text style={styles.prixInfo}>Paiement unique — acces niveau Verifie</Text>
      </View>
      <TouchableOpacity
        style={styles.btnPayer}
        onPress={() => navigation.navigate('PayerCotisation')}
      >
        <Text style={styles.btnTexte}>Payer maintenant</Text>
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
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22 },
  prixCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 20,
    padding: 24, alignItems: 'center', width: '100%',
  },
  prix: { fontSize: 36, fontWeight: 'bold', color: Colors.primary },
  prixInfo: { fontSize: 13, color: Colors.grey, marginTop: 4 },
  btnPayer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    paddingHorizontal: 40, borderRadius: 16,
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});