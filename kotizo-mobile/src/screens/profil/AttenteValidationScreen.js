import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function AttenteValidationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>⏳</Text>
      <Text style={styles.titre}>Verification en cours</Text>
      <Text style={styles.sousTitre}>
        Votre dossier est en cours d'examen.{'\n'}
        Vous serez notifie sous 24h.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Profil')}>
        <Text style={styles.btnTexte}>Retour au profil</Text>
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
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 24 },
  btn: {
    backgroundColor: Colors.primary, paddingVertical: 14,
    paddingHorizontal: 32, borderRadius: 16, marginTop: 16,
  },
  btnTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});