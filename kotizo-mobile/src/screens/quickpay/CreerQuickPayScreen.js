import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function CreerQuickPayScreen({ navigation }) {
  const [destinataire, setDestinataire] = useState('');
  const [destinataireId, setDestinatataireId] = useState(null);
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const creer = async () => {
    if (!destinataireId || !montant) {
      setErreur('Destinataire et montant requis');
      return;
    }
    setLoading(true);
    setErreur('');
    try {
      const res = await api.post('/paiements/quickpay/', {
        destinataire_id: destinataireId,
        montant: parseFloat(montant),
        message,
      });
      navigation.replace('QuickPayGenere', { quickpay: res.data });
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur creation');
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
        <Text style={styles.titre}>Nouveau QuickPay</Text>
      </View>

      {erreur ? (
        <View style={styles.erreurBox}>
          <Text style={styles.erreurTexte}>{erreur}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Email du destinataire</Text>
      <TextInput
        style={styles.input}
        value={destinataire}
        onChangeText={setDestinataire}
        placeholder="email@exemple.com"
        placeholderTextColor={Colors.grey}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Montant (FCFA)</Text>
      <TextInput
        style={styles.inputGrand}
        value={montant}
        onChangeText={setMontant}
        placeholder="0"
        placeholderTextColor={Colors.grey}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Message (optionnel)</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Pour quoi ?"
        placeholderTextColor={Colors.grey}
        maxLength={200}
      />

      <TouchableOpacity
        style={[styles.btnCreer, loading && styles.btnDesactive]}
        onPress={creer}
        disabled={loading}
      >
        <Text style={styles.btnTexte}>
          {loading ? 'Creation...' : 'Creer le QuickPay'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  erreurBox: {
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  erreurTexte: { color: Colors.error, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
  },
  inputGrand: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 18, fontSize: 32, fontWeight: 'bold',
    color: Colors.primary, backgroundColor: Colors.greyLight,
    textAlign: 'center',
  },
  btnCreer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 32,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});