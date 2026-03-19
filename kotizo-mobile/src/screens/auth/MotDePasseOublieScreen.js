import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function MotDePasseOublieScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [canal, setCanal] = useState('email');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const envoyer = async () => {
    if (!email) return;
    setLoading(true);
    setErreur('');
    try {
      await api.post('/auth/reset-password/', { email, canal });
      navigation.navigate('Reinitialisation', { email, canal });
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur reseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Mot de passe oublie</Text>
        <Text style={styles.sousTitre}>
          Saisissez votre email pour recevoir un code de reinitialisation
        </Text>
      </View>

      {erreur ? (
        <View style={styles.erreurBox}>
          <Text style={styles.erreurTexte}>{erreur}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="votre@email.com"
        placeholderTextColor={Colors.grey}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Recevoir le code par</Text>
      <View style={styles.canalRow}>
        <TouchableOpacity
          style={[styles.canalBtn, canal === 'email' && styles.canalActif]}
          onPress={() => setCanal('email')}
        >
          <Text style={[styles.canalTexte, canal === 'email' && styles.canalTexteActif]}>
            Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.canalBtn, canal === 'whatsapp' && styles.canalActif]}
          onPress={() => setCanal('whatsapp')}
        >
          <Text style={[styles.canalTexte, canal === 'whatsapp' && styles.canalTexteActif]}>
            WhatsApp
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btnPrimaire, loading && styles.btnDesactive]}
        onPress={envoyer}
        disabled={loading}
      >
        <Text style={styles.btnTexte}>
          {loading ? 'Envoi...' : 'Envoyer le code'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 32 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 16 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, lineHeight: 22 },
  erreurBox: {
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  erreurTexte: { color: Colors.error, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight, marginBottom: 20,
  },
  canalRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  canalBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.greyBorder, alignItems: 'center',
  },
  canalActif: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  canalTexte: { fontSize: 15, color: Colors.grey, fontWeight: '600' },
  canalTexteActif: { color: Colors.primary },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});