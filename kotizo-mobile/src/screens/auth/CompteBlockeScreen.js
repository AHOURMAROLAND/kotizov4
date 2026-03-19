import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CompteBlockeScreen({ navigation, route }) {
  const dureeMinutes = route.params?.dureeMinutes || 30;
  const [secondes, setSecondes] = useState(dureeMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondes(s => {
        if (s <= 1) {
          clearInterval(timer);
          navigation.replace('Connexion');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTemps = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>🔒</Text>
      </View>

      <Text style={styles.titre}>Compte temporairement bloque</Text>
      <Text style={styles.sousTitre}>
        Trop de tentatives de connexion. Reessayez dans :
      </Text>

      <View style={styles.timerBox}>
        <Text style={styles.timer}>{formatTemps(secondes)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnSupport}
          onPress={() => navigation.navigate('MainTabs', { screen: 'AgentIA' })}
        >
          <Text style={styles.btnSupportTexte}>Contacter le support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lienRetour}
          onPress={() => navigation.replace('Connexion')}
        >
          <Text style={styles.lienTexte}>Retour a la connexion</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FEF2F2', alignItems: 'center',
    justifyContent: 'center', marginBottom: 24,
  },
  icone: { fontSize: 48 },
  titre: {
    fontSize: 22, fontWeight: 'bold',
    color: Colors.black, textAlign: 'center', marginBottom: 12,
  },
  sousTitre: {
    fontSize: 15, color: Colors.grey,
    textAlign: 'center', lineHeight: 22, marginBottom: 32,
  },
  timerBox: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 40,
    paddingVertical: 20, borderRadius: 20, marginBottom: 48,
  },
  timer: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  actions: { width: '100%', gap: 12 },
  btnSupport: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnSupportTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienRetour: { alignItems: 'center', paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});