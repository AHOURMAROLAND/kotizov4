import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../utils/colors';

const OPERATEURS = [
  { id: 'mixx', nom: 'Mixx by Yas', emoji: '📱', couleur: '#FF6B00' },
  { id: 'moov', nom: 'Moov Money', emoji: '💚', couleur: '#00A651' },
  { id: 'tmoney', nom: 'T-Money', emoji: '💙', couleur: '#0066CC' },
];

export default function ChoixOperateurScreen({ navigation, route }) {
  const { participation, cotisation } = route.params || {};
  const [operateur, setOperateur] = useState('mixx');
  const [telephone, setTelephone] = useState('');

  const payer = () => {
    if (!telephone) return;
    navigation.navigate('PaiementEnAttente', { participation, cotisation, operateur, telephone });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Payer {participation?.montant} FCFA</Text>
      </View>

      <Text style={styles.sectionLabel}>Choisir l'operateur</Text>
      <View style={styles.operateurs}>
        {OPERATEURS.map(op => (
          <TouchableOpacity
            key={op.id}
            style={[styles.operateurCard, operateur === op.id && styles.operateurActif]}
            onPress={() => setOperateur(op.id)}
          >
            <Text style={styles.operateurEmoji}>{op.emoji}</Text>
            <Text style={styles.operateurNom}>{op.nom}</Text>
            <View style={[styles.radio, operateur === op.id && styles.radioActif]} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Numero de telephone</Text>
      <TextInput
        style={styles.input}
        value={telephone}
        onChangeText={setTelephone}
        placeholder="+228 90 00 00 00"
        placeholderTextColor={Colors.grey}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.btnPayer, !telephone && styles.btnDesactive]}
        onPress={payer}
        disabled={!telephone}
      >
        <Text style={styles.btnPayerTexte}>Payer maintenant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 12 },
  operateurs: { gap: 10, marginBottom: 24 },
  operateurCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.greyBorder, borderRadius: 16, padding: 16,
  },
  operateurActif: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  operateurEmoji: { fontSize: 24, marginRight: 12 },
  operateurNom: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.greyBorder },
  radioActif: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: Colors.black, backgroundColor: Colors.greyLight, marginBottom: 32,
  },
  btnPayer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnPayerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});