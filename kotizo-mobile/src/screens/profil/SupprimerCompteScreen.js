import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function SupprimerCompteScreen({ navigation }) {
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const { deconnexion } = useAuthStore();

  const MOT_CONFIRMATION = 'SUPPRIMER';

  const supprimer = async () => {
    if (confirmation !== MOT_CONFIRMATION) return;
    setLoading(true);
    await deconnexion();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Supprimer le compte</Text>
      </View>

      <View style={styles.avertissement}>
        <Text style={styles.avertissementTitre}>Action irreversible</Text>
        <Text style={styles.avertissementTexte}>
          Toutes vos donnees seront supprimees definitivement.
          Cette action est impossible si vous avez des cotisations actives.
        </Text>
      </View>

      <Text style={styles.label}>
        Tapez <Text style={styles.motConfirmation}>{MOT_CONFIRMATION}</Text> pour confirmer
      </Text>
      <TextInput
        style={[styles.input, confirmation === MOT_CONFIRMATION && styles.inputValide]}
        value={confirmation}
        onChangeText={setConfirmation}
        placeholder={MOT_CONFIRMATION}
        placeholderTextColor={Colors.grey}
        autoCapitalize="characters"
      />

      <TouchableOpacity
        style={[
          styles.btnSupprimer,
          confirmation !== MOT_CONFIRMATION && styles.btnDesactive
        ]}
        onPress={supprimer}
        disabled={confirmation !== MOT_CONFIRMATION || loading}
      >
        <Text style={styles.btnTexte}>
          {loading ? 'Suppression...' : 'Supprimer definitivement'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.grey, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  avertissement: {
    backgroundColor: '#FEF2F2', borderRadius: 16,
    padding: 16, marginBottom: 32,
    borderWidth: 1, borderColor: '#FECACA',
  },
  avertissementTitre: { fontSize: 16, fontWeight: 'bold', color: Colors.error, marginBottom: 8 },
  avertissementTexte: { fontSize: 14, color: Colors.error, lineHeight: 20 },
  label: { fontSize: 14, color: Colors.black, marginBottom: 8 },
  motConfirmation: { fontWeight: 'bold', color: Colors.error },
  input: {
    borderWidth: 2, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
    marginBottom: 24, textAlign: 'center', letterSpacing: 2,
  },
  inputValide: { borderColor: Colors.error },
  btnSupprimer: {
    backgroundColor: Colors.error, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});