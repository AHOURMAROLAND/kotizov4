import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../utils/colors';

export default function ActivationBiometrieScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const activer = async () => {
    setLoading(true);
    try {
      const disponible = await LocalAuthentication.hasHardwareAsync();
      const inscrit = await LocalAuthentication.isEnrolledAsync();
      if (!disponible || !inscrit) { navigation.replace('MainTabs'); return; }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Activez la connexion rapide Kotizo',
        fallbackLabel: 'Utiliser mot de passe',
      });
      if (result.success) await AsyncStorage.setItem('biometrie_activee', 'true');
    } catch {}
    navigation.replace('MainTabs');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>👆</Text>
      </View>
      <Text style={styles.titre}>Connexion rapide</Text>
      <Text style={styles.sousTitre}>
        Activez Face ID ou votre empreinte digitale pour vous connecter plus rapidement
      </Text>
      <View style={styles.avantages}>
        {['Connexion en 1 seconde', 'Plus securise', 'Pas besoin de mot de passe'].map(item => (
          <View key={item} style={styles.avantageRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.avantageTexte}>{item}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.btnPrimaire, loading && styles.btnDesactive]}
        onPress={activer}
        disabled={loading}
      >
        <Text style={styles.btnTexte}>Activer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.lienPlusTard} onPress={() => navigation.replace('MainTabs')}>
        <Text style={styles.lienTexte}>Plus tard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center',
  },
  iconeContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  icone: { fontSize: 48 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 12, textAlign: 'center' },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  avantages: { width: '100%', marginBottom: 40, gap: 12 },
  avantageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { color: Colors.success, fontSize: 18, fontWeight: 'bold' },
  avantageTexte: { fontSize: 15, color: Colors.black },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', width: '100%', marginBottom: 12,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienPlusTard: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});