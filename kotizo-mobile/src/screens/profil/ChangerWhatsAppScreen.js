import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../../utils/colors';

export default function ChangerWhatsAppScreen({ navigation }) {
  const [nouveauNumero, setNouveauNumero] = useState('');
  const [etape, setEtape] = useState(1);

  const passerEtape2 = () => {
    if (!nouveauNumero) return;
    setEtape(2);
  };

  const ouvrirAncienWA = () => {
    Linking.openURL('https://wa.me/?text=KOTIZO-CONFIRM-CHANGEMENT');
  };

  const ouvrirNouveauWA = () => {
    Linking.openURL(`https://wa.me/${nouveauNumero}?text=KOTIZO-CONFIRM-NOUVEAU`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Changer WhatsApp</Text>
      </View>

      {etape === 1 && (
        <View style={styles.etape}>
          <Text style={styles.etapeNumero}>Etape 1/2</Text>
          <Text style={styles.etapeDescription}>
            Confirmez depuis votre ancien numero WhatsApp
          </Text>
          <Text style={styles.label}>Nouveau numero</Text>
          <TextInput
            style={styles.input}
            value={nouveauNumero}
            onChangeText={setNouveauNumero}
            placeholder="+228 90 00 00 00"
            placeholderTextColor={Colors.grey}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.btn} onPress={passerEtape2}>
            <Text style={styles.btnTexte}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}

      {etape === 2 && (
        <View style={styles.etape}>
          <Text style={styles.etapeNumero}>Etape 2/2</Text>
          <Text style={styles.etapeDescription}>
            Confirmez depuis votre ancien WhatsApp, puis depuis le nouveau
          </Text>
          <TouchableOpacity style={styles.btnWA} onPress={ouvrirAncienWA}>
            <Text style={styles.btnWATexte}>Confirmer depuis l'ancien numero</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnWA, styles.btnWA2]} onPress={ouvrirNouveauWA}>
            <Text style={styles.btnWATexte}>Confirmer depuis le nouveau numero</Text>
          </TouchableOpacity>
          <Text style={styles.info}>
            Vous avez 5 minutes. Envoyez STOP pour annuler.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  etape: { flex: 1, gap: 16 },
  etapeNumero: { fontSize: 13, color: Colors.grey, fontWeight: '600' },
  etapeDescription: { fontSize: 15, color: Colors.black, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: Colors.black, backgroundColor: Colors.greyLight,
  },
  btn: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  btnWA: {
    backgroundColor: '#25D366', paddingVertical: 14,
    borderRadius: 16, alignItems: 'center',
  },
  btnWA2: { backgroundColor: Colors.primary },
  btnWATexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  info: { fontSize: 13, color: Colors.grey, textAlign: 'center' },
});