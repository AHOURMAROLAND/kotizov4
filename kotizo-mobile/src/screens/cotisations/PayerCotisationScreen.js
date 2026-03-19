import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Colors } from '../../utils/colors';

const OPERATEURS = [
  { id: 'mixx', nom: 'Mixx by Yas', couleur: '#F59E0B' },
  { id: 'moov', nom: 'Moov Money', couleur: '#3B82F6' },
  { id: 'tmoney', nom: 'T-Money', couleur: '#EF4444' },
];

export default function PayerCotisationScreen({ navigation, route }) {
  const { participation, cotisation } = route.params;
  const [operateur, setOperateur] = useState(null);

  const continuer = () => {
    if (!operateur) return;
    navigation.navigate('ChoixOperateur', { participation, cotisation, operateur });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Payer ma cotisation</Text>
      </View>

      <View style={styles.resumeBox}>
        <Text style={styles.resumeTitre}>{cotisation.titre}</Text>
        <Text style={styles.resumeMontant}>{participation.montant} FCFA</Text>
      </View>

      <Text style={styles.sectionTitre}>Choisissez votre operateur</Text>

      <View style={styles.operateurs}>
        {OPERATEURS.map(op => (
          <TouchableOpacity
            key={op.id}
            style={[
              styles.operateurBtn,
              operateur === op.id && { borderColor: op.couleur, backgroundColor: `${op.couleur}10` }
            ]}
            onPress={() => setOperateur(op.id)}
          >
            <View style={[styles.operateurPoint, { backgroundColor: op.couleur }]} />
            <Text style={styles.operateurNom}>{op.nom}</Text>
            <View style={[styles.radio, operateur === op.id && { borderColor: op.couleur, backgroundColor: op.couleur }]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPayer, !operateur && styles.btnDesactive]}
          onPress={continuer}
          disabled={!operateur}
        >
          <Text style={styles.btnPayerTexte}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  resumeBox: {
    margin: 16, backgroundColor: Colors.primaryLight,
    borderRadius: 16, padding: 20, alignItems: 'center',
  },
  resumeTitre: { fontSize: 16, color: Colors.grey, marginBottom: 4 },
  resumeMontant: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  sectionTitre: { fontSize: 16, fontWeight: 'bold', color: Colors.black, marginHorizontal: 24, marginBottom: 12 },
  operateurs: { paddingHorizontal: 16, gap: 12 },
  operateurBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.greyBorder,
    borderRadius: 16, padding: 16,
  },
  operateurPoint: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  operateurNom: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.black },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.greyBorder,
  },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 },
  btnPayer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnPayerTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});