import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Modal
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function ReconfirmationMotDePasseScreen({ navigation, route }) {
  const { onConfirme, titre, description } = route.params || {};
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const confirmer = async () => {
    if (!password) return;
    setLoading(true);
    setErreur('');
    try {
      const api = (await import('../../services/api')).default;
      await api.post('/auth/connexion/', { email: user?.email, password });
      navigation.goBack();
      if (onConfirme) onConfirme();
    } catch {
      setErreur('Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.titre}>{titre || 'Confirmation requise'}</Text>
          <Text style={styles.description}>
            {description || 'Saisissez votre mot de passe pour continuer'}
          </Text>

          {erreur ? <Text style={styles.erreur}>{erreur}</Text> : null}

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Votre mot de passe"
            placeholderTextColor={Colors.grey}
            secureTextEntry
            autoFocus
          />

          <View style={styles.boutons}>
            <TouchableOpacity
              style={styles.btnAnnuler}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnAnnulerTexte}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnConfirmer, loading && styles.btnDesactive]}
              onPress={confirmer}
              disabled={loading}
            >
              <Text style={styles.btnConfirmerTexte}>
                {loading ? '...' : 'Confirmer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modal: {
    backgroundColor: Colors.white, borderRadius: 20,
    padding: 24, width: '100%',
  },
  titre: { fontSize: 18, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.grey, marginBottom: 16, lineHeight: 20 },
  erreur: { color: Colors.error, fontSize: 13, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight, marginBottom: 16,
  },
  boutons: { flexDirection: 'row', gap: 12 },
  btnAnnuler: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.greyBorder, alignItems: 'center',
  },
  btnAnnulerTexte: { color: Colors.grey, fontSize: 15 },
  btnConfirmer: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnConfirmerTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});