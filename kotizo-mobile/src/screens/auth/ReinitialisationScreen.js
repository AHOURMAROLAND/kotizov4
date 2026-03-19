import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function ReinitialisationScreen({ navigation, route }) {
  const { email, canal } = route.params || {};
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [secondes, setSecondes] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondes(s => { if (s <= 1) { clearInterval(timer); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTemps = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const confirmer = async () => {
    if (!token || !password || password !== password2) {
      setErreur('Verifiez les champs');
      return;
    }
    setLoading(true);
    setErreur('');
    try {
      await api.post('/auth/reset-password/confirmer/', {
        email, token, nouveau_password: password, nouveau_password2: password2
      });
      navigation.replace('Connexion');
    } catch (err) {
      setErreur(err.response?.data?.error || 'Code invalide ou expire');
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
        <Text style={styles.titre}>Nouveau mot de passe</Text>
        <Text style={styles.sousTitre}>
          Code envoye par {canal === 'whatsapp' ? 'WhatsApp' : 'email'}
        </Text>
        <Text style={[styles.timer, secondes < 60 && styles.timerUrgent]}>
          {formatTemps(secondes)}
        </Text>
      </View>

      {erreur ? (
        <View style={styles.erreurBox}>
          <Text style={styles.erreurTexte}>{erreur}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Code de verification</Text>
      <TextInput
        style={styles.input}
        value={token}
        onChangeText={setToken}
        placeholder="Code a 8 caracteres"
        placeholderTextColor={Colors.grey}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Minimum 8 caracteres"
        placeholderTextColor={Colors.grey}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password2}
        onChangeText={setPassword2}
        placeholder="Repetez le mot de passe"
        placeholderTextColor={Colors.grey}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.btnPrimaire, loading && styles.btnDesactive]}
        onPress={confirmer}
        disabled={loading}
      >
        <Text style={styles.btnTexte}>
          {loading ? 'Reinitialisation...' : 'Reinitialiser'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 4 },
  sousTitre: { fontSize: 15, color: Colors.grey, marginBottom: 8 },
  timer: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  timerUrgent: { color: Colors.error },
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
    color: Colors.black, backgroundColor: Colors.greyLight, marginBottom: 16,
  },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 8,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});