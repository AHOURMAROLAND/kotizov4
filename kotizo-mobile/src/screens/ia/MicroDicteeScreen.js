import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/colors';

export default function MicroDicteeScreen({ navigation, route }) {
  const { onTexteCapture } = route.params || {};
  const [etape, setEtape] = useState('pret');
  const [secondes, setSecondes] = useState(0);

  const demarrer = () => {
    setEtape('enregistrement');
    const timer = setInterval(() => {
      setSecondes(s => s + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      setEtape('traitement');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 30000);
  };

  const arreter = () => {
    setEtape('traitement');
    setTimeout(() => navigation.goBack(), 1500);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fermer} onPress={() => navigation.goBack()}>
        <Text style={styles.fermerTexte}>Annuler</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {etape === 'pret' && (
          <>
            <Text style={styles.icone}>🎙</Text>
            <Text style={styles.instruction}>Appuyez pour dicter votre message</Text>
            <TouchableOpacity style={styles.btnMicro} onPress={demarrer}>
              <Text style={styles.btnMicroTexte}>Dicter</Text>
            </TouchableOpacity>
          </>
        )}

        {etape === 'enregistrement' && (
          <>
            <View style={styles.barres}>
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={[styles.barre, { height: 20 + (i * 8) }]} />
              ))}
            </View>
            <Text style={styles.timer}>{secondes}s</Text>
            <TouchableOpacity style={styles.btnArreter} onPress={arreter}>
              <Text style={styles.btnArreterTexte}>Arreter</Text>
            </TouchableOpacity>
          </>
        )}

        {etape === 'traitement' && (
          <>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.instruction}>Transcription en cours...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  fermer: { paddingTop: 56, paddingLeft: 24, paddingBottom: 16 },
  fermerTexte: { color: Colors.white, fontSize: 16 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  icone: { fontSize: 80 },
  instruction: { color: Colors.white, fontSize: 16, textAlign: 'center' },
  btnMicro: {
    backgroundColor: Colors.primary, width: 80, height: 80,
    borderRadius: 40, alignItems: 'center', justifyContent: 'center',
  },
  btnMicroTexte: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
  barres: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 80 },
  barre: { width: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  timer: { color: Colors.white, fontSize: 32, fontWeight: 'bold' },
  btnArreter: {
    backgroundColor: Colors.error, paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 16,
  },
  btnArreterTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});