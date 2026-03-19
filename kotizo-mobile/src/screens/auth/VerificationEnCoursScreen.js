import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/colors';

export default function VerificationEnCoursScreen({ navigation, route }) {
  const { email, telephone, canal, prenom } = route.params || {};
  const [secondes, setSecondes] = useState(300);
  const [peutRenvoyer, setPeutRenvoyer] = useState(false);
  const [compteurRenvoi, setCompteurRenvoi] = useState(60);

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
    const timer = setInterval(() => {
      setCompteurRenvoi(c => {
        if (c <= 1) { clearInterval(timer); setPeutRenvoyer(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTemps = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Verification en cours</Text>
        <Text style={styles.sousTitre}>
          {canal === 'whatsapp'
            ? 'Ouvrez WhatsApp et envoyez le message pre-rempli'
            : 'Verifiez votre boite mail — lien valable 5 minutes'}
        </Text>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.canal}>
          {canal === 'whatsapp' ? `WhatsApp : ${telephone}` : `Email : ${email}`}
        </Text>
        <View style={styles.timerBox}>
          <Text style={styles.timerTexte}>Expire dans</Text>
          <Text style={[styles.timer, secondes < 60 && styles.timerUrgent]}>
            {formatTemps(secondes)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btnRenvoyer, !peutRenvoyer && styles.btnDesactive]}
          disabled={!peutRenvoyer}
        >
          <Text style={styles.btnRenvoyerTexte}>
            {peutRenvoyer ? 'Renvoyer le code' : `Renvoyer dans ${compteurRenvoi}s`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lienChanger}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.lienTexte}>Changer de canal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 64, paddingBottom: 32 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, lineHeight: 22 },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  canal: { fontSize: 15, color: Colors.grey },
  timerBox: { alignItems: 'center' },
  timerTexte: { fontSize: 13, color: Colors.grey, marginBottom: 4 },
  timer: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  timerUrgent: { color: Colors.error },
  actions: { paddingBottom: 48, gap: 12 },
  btnRenvoyer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnRenvoyerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienChanger: { alignItems: 'center', paddingVertical: 8 },
  lienTexte: { color: Colors.primary, fontSize: 15 },
});