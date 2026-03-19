import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function ChoixCanalScreen({ navigation, route }) {
  const { email, telephone, prenom } = route.params || {};
  const [canal, setCanal] = useState('whatsapp');

  const confirmer = () => {
    navigation.navigate('VerificationEnCours', { email, telephone, canal, prenom });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Verifiez votre compte</Text>
        <Text style={styles.sousTitre}>
          Choisissez comment recevoir votre code de verification
        </Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.option, canal === 'whatsapp' && styles.optionSelectionnee]}
          onPress={() => setCanal('whatsapp')}
        >
          <Text style={styles.optionEmoji}>📱</Text>
          <View style={styles.optionTextes}>
            <Text style={styles.optionTitre}>WhatsApp (recommande)</Text>
            <Text style={styles.optionDetail}>{telephone}</Text>
          </View>
          <View style={[styles.radio, canal === 'whatsapp' && styles.radioActif]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, canal === 'email' && styles.optionSelectionnee]}
          onPress={() => setCanal('email')}
        >
          <Text style={styles.optionEmoji}>📧</Text>
          <View style={styles.optionTextes}>
            <Text style={styles.optionTitre}>Email</Text>
            <Text style={styles.optionDetail}>{email}</Text>
          </View>
          <View style={[styles.radio, canal === 'email' && styles.radioActif]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        Le premier canal valide active votre compte
      </Text>

      <TouchableOpacity style={styles.btnPrimaire} onPress={confirmer}>
        <Text style={styles.btnTexte}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 32 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, lineHeight: 22 },
  options: { gap: 12, marginBottom: 24 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.greyBorder,
    borderRadius: 16, padding: 16,
  },
  optionSelectionnee: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  optionEmoji: { fontSize: 28, marginRight: 12 },
  optionTextes: { flex: 1 },
  optionTitre: { fontSize: 15, fontWeight: '600', color: Colors.black },
  optionDetail: { fontSize: 13, color: Colors.grey, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.greyBorder,
  },
  radioActif: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  info: { color: Colors.grey, fontSize: 13, textAlign: 'center', marginBottom: 32 },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});