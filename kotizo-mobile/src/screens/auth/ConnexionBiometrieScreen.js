import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function ConnexionBiometrieScreen({ navigation }) {
  const [erreur, setErreur] = useState('');
  const { chargerProfil } = useAuthStore();

  useEffect(() => {
    authentifier();
  }, []);

  const authentifier = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Connectez-vous a Kotizo',
        fallbackLabel: 'Utiliser mot de passe',
      });

      if (result.success) {
        await chargerProfil();
        navigation.replace('MainTabs');
      } else {
        setErreur('Authentification echouee');
      }
    } catch {
      setErreur('Biometrie non disponible');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>K.</Text>
        </View>
        <Text style={styles.appName}>Kotizo</Text>
      </View>

      <View style={styles.biometrieContainer}>
        <TouchableOpacity style={styles.iconeBtn} onPress={authentifier}>
          <Text style={styles.icone}>👆</Text>
        </TouchableOpacity>
        <Text style={styles.message}>
          Posez votre doigt ou regardez l'ecran
        </Text>
        {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.lienMdp}
        onPress={() => navigation.replace('Connexion')}
      >
        <Text style={styles.lienTexte}>Utiliser mon mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 80,
  },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logoText: { fontSize: 36, fontWeight: 'bold', color: Colors.white },
  appName: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  biometrieContainer: { alignItems: 'center', gap: 16 },
  iconeBtn: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  icone: { fontSize: 48 },
  message: { fontSize: 15, color: Colors.grey, textAlign: 'center' },
  erreur: { color: Colors.error, fontSize: 14, textAlign: 'center' },
  lienMdp: { paddingVertical: 8 },
  lienTexte: { color: Colors.primary, fontSize: 15 },
});