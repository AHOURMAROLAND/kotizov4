import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function PaiementEnAttenteScreen({ navigation, route }) {
  const { transactionId, cotisationSlug, operateur } = route.params;
  const [secondes, setSecondes] = useState(180);
  const [verifications, setVerifications] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondes(s => {
        if (s <= 1) { clearInterval(timer); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const polling = setInterval(async () => {
      try {
        const res = await api.get(`/paiements/statut/${transactionId}/`);
        if (res.data.statut === 'success') {
          clearInterval(polling);
          navigation.replace('ConfirmationPaiement', { cotisationSlug });
        } else if (res.data.statut === 'failed') {
          clearInterval(polling);
          navigation.goBack();
        }
        setVerifications(v => v + 1);
      } catch {}
    }, 5000);
    return () => clearInterval(polling);
  }, []);

  const formatTemps = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contenu}>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        <Text style={styles.titre}>Paiement en attente</Text>
        <Text style={styles.sousTitre}>
          Confirmez le paiement sur votre telephone {operateur}
        </Text>

        <View style={styles.timerBox}>
          <Text style={[styles.timer, secondes < 60 && styles.timerUrgent]}>
            {formatTemps(secondes)}
          </Text>
          <Text style={styles.timerLabel}>
            {secondes === 0 ? 'Delai expire' : 'Temps restant'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {secondes === 0 && (
          <TouchableOpacity
            style={styles.btnReessayer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnTexte}>Reessayer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.btnAnnuler}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnAnnulerTexte}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  contenu: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loader: { marginBottom: 24 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black, marginBottom: 8, textAlign: 'center' },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  timerBox: { alignItems: 'center' },
  timer: { fontSize: 48, fontWeight: 'bold', color: Colors.primary },
  timerUrgent: { color: Colors.error },
  timerLabel: { fontSize: 14, color: Colors.grey, marginTop: 4 },
  footer: { padding: 24, gap: 12 },
  btnReessayer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnAnnuler: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  btnAnnulerTexte: { color: Colors.grey, fontSize: 16 },
});