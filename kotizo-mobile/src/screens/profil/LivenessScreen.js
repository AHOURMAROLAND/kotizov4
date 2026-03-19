import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/colors';

export default function LivenessScreen({ navigation, route }) {
  const { photoRecto, photoVerso } = route.params || {};
  const [etape, setEtape] = useState('pret');

  const demarrer = () => {
    setEtape('enregistrement');
    setTimeout(() => {
      setEtape('traitement');
      setTimeout(() => {
        navigation.replace('AttenteValidation');
      }, 2000);
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Selfie video</Text>
        <Text style={styles.etapeNum}>3/3</Text>
      </View>

      <View style={styles.guide}>
        <View style={styles.cercle}>
          {etape === 'pret' && <Text style={styles.emoji}>🤳</Text>}
          {etape === 'enregistrement' && <ActivityIndicator size="large" color={Colors.primary} />}
          {etape === 'traitement' && <Text style={styles.emoji}>⏳</Text>}
        </View>
        <Text style={styles.instruction}>
          {etape === 'pret' && 'Regardez la camera et tournez legerement la tete'}
          {etape === 'enregistrement' && 'Enregistrement en cours... (5 secondes)'}
          {etape === 'traitement' && 'Traitement en cours...'}
        </Text>
      </View>

      {etape === 'pret' && (
        <TouchableOpacity style={styles.btnDemarrer} onPress={demarrer}>
          <Text style={styles.btnTexte}>Demarrer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
  },
  retour: { color: Colors.white, fontSize: 16 },
  titre: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  etapeNum: { color: Colors.white, fontSize: 14 },
  guide: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  cercle: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 3, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 64 },
  instruction: { color: Colors.white, fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },
  btnDemarrer: {
    margin: 24, backgroundColor: Colors.primary,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});