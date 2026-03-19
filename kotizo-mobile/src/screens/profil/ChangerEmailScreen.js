import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function ChangerEmailScreen({ navigation }) {
  const [nouvelEmail, setNouvelEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const envoyer = async () => {
    if (!nouvelEmail || !nouvelEmail.includes('@')) {
      setErreur('Email invalide');
      return;
    }
    setLoading(true);
    try {
      navigation.navigate('ReconfirmationMotDePasse', {
        titre: 'Confirmer le changement',
        description: `Votre email sera change en ${nouvelEmail}`,
      });
    } catch { setErreur('Erreur'); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Changer l'email</Text>
      </View>
      {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}
      <Text style={styles.label}>Nouvel email</Text>
      <TextInput
        style={styles.input}
        value={nouvelEmail}
        onChangeText={setNouvelEmail}
        placeholder="nouvel@email.com"
        placeholderTextColor={Colors.grey}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDesactive]}
        onPress={envoyer}
        disabled={loading}
      >
        <Text style={styles.btnTexte}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  erreur: { color: Colors.error, fontSize: 13, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: Colors.black, backgroundColor: Colors.greyLight, marginBottom: 24,
  },
  btn: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});