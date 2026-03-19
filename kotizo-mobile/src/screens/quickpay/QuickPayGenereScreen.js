import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../utils/colors';

export default function QuickPayGenereScreen({ navigation, route }) {
  const { quickpay } = route.params;
  const [secondes, setSecondes] = useState(3600);

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

  const formatTemps = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const partager = async () => {
    await Share.share({
      message: `Paiement QuickPay Kotizo\nMontant : ${quickpay.montant} FCFA\n${quickpay.message || ''}`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.montant}>{quickpay.montant} FCFA</Text>
        {quickpay.message ? (
          <Text style={styles.message}>{quickpay.message}</Text>
        ) : null}

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>Expire dans</Text>
          <Text style={[styles.timer, secondes < 600 && styles.timerUrgent]}>
            {formatTemps(secondes)}
          </Text>
        </View>

        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrTexte}>QR Code</Text>
          <Text style={styles.qrSousTitre}>Scannez pour payer</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPartager} onPress={partager}>
          <Text style={styles.btnPartagerTexte}>Partager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.lienRetour}
          onPress={() => navigation.navigate('QuickPay')}
        >
          <Text style={styles.lienTexte}>Retour a l'historique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 16 },
  retour: { color: Colors.primary, fontSize: 16 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  montant: { fontSize: 48, fontWeight: 'bold', color: Colors.primary },
  message: { fontSize: 16, color: Colors.grey },
  timerBox: { alignItems: 'center' },
  timerLabel: { fontSize: 13, color: Colors.grey, marginBottom: 4 },
  timer: { fontSize: 32, fontWeight: 'bold', color: Colors.black },
  timerUrgent: { color: Colors.error },
  qrPlaceholder: {
    width: 180, height: 180, borderRadius: 16,
    backgroundColor: Colors.greyLight, borderWidth: 2,
    borderColor: Colors.greyBorder, alignItems: 'center', justifyContent: 'center',
  },
  qrTexte: { fontSize: 16, fontWeight: 'bold', color: Colors.grey },
  qrSousTitre: { fontSize: 12, color: Colors.grey, marginTop: 4 },
  actions: { gap: 12, paddingBottom: 24 },
  btnPartager: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnPartagerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienRetour: { alignItems: 'center', paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});