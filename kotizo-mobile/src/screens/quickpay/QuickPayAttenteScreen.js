import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/colors';

export default function QuickPayAttenteScreen({ navigation, route }) {
  const { quickpay } = route.params || {};
  const [secondes, setSecondes] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondes(s => {
        if (s <= 1) {
          clearInterval(timer);
          navigation.replace('QuickPayExpire', { quickpay });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTemps = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 24 }} />
      <Text style={styles.titre}>Paiement en cours</Text>
      <Text style={styles.sousTitre}>En attente de confirmation du payeur</Text>
      <View style={styles.timerBox}>
        <Text style={styles.timerLabel}>Expire dans</Text>
        <Text style={[styles.timer, secondes < 60 && styles.timerUrgent]}>
          {formatTemps(secondes)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16,
  },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center' },
  timerBox: { alignItems: 'center', marginTop: 16 },
  timerLabel: { fontSize: 13, color: Colors.grey, marginBottom: 4 },
  timer: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  timerUrgent: { color: Colors.error },
});