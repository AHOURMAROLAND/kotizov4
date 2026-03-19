import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function InscriptionScreen({ navigation }) {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '',
    telephone_whatsapp: '', password: '', password2: ''
  });
  const [erreurs, setErreurs] = useState({});
  const [loading, setLoading] = useState(false);

  const valider = () => {
    const e = {};
    if (!form.prenom) e.prenom = 'Prenom requis';
    if (!form.nom) e.nom = 'Nom requis';
    if (!form.email || !form.email.includes('@')) e.email = 'Email invalide';
    if (!form.telephone_whatsapp) e.telephone_whatsapp = 'Telephone requis';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 caracteres';
    if (form.password !== form.password2) e.password2 = 'Les mots de passe ne correspondent pas';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const inscrire = async () => {
    if (!valider()) return;
    setLoading(true);
    try {
      await api.post('/auth/inscription/', form);
      navigation.navigate('ChoixCanal', {
        email: form.email,
        telephone: form.telephone_whatsapp,
        prenom: form.prenom,
      });
    } catch (err) {
      const data = err.response?.data || {};
      setErreurs(data);
    } finally {
      setLoading(false);
    }
  };

  const champ = (key, label, props = {}) => (
    <View style={styles.champContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erreurs[key] && styles.inputErreur]}
        value={form[key]}
        onChangeText={(v) => setForm({ ...form, [key]: v })}
        placeholderTextColor={Colors.grey}
        {...props}
      />
      {erreurs[key] ? <Text style={styles.erreurTexte}>{erreurs[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.retour}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.titre}>Creer un compte</Text>
          <Text style={styles.sousTitre}>Rejoignez Kotizo gratuitement</Text>
        </View>

        {champ('prenom', 'Prenom', { placeholder: 'Votre prenom' })}
        {champ('nom', 'Nom', { placeholder: 'Votre nom' })}
        {champ('email', 'Email', {
          placeholder: 'votre@email.com',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        })}
        {champ('telephone_whatsapp', 'Telephone WhatsApp', {
          placeholder: '+228 90 00 00 00',
          keyboardType: 'phone-pad',
        })}
        {champ('password', 'Mot de passe', {
          placeholder: 'Minimum 8 caracteres',
          secureTextEntry: true,
        })}
        {champ('password2', 'Confirmer le mot de passe', {
          placeholder: 'Repetez le mot de passe',
          secureTextEntry: true,
        })}

        <TouchableOpacity
          style={[styles.btnPrimaire, loading && styles.btnDesactive]}
          onPress={inscrire}
          disabled={loading}
        >
          <Text style={styles.btnTexte}>
            {loading ? 'Creation...' : 'Creer mon compte'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lienConnexion}
          onPress={() => navigation.navigate('Connexion')}
        >
          <Text style={styles.lienTexte}>Deja un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { paddingTop: 56, paddingBottom: 24 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 16 },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 4 },
  sousTitre: { fontSize: 15, color: Colors.grey },
  champContainer: { marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
    marginBottom: 4,
  },
  inputErreur: { borderColor: Colors.error },
  erreurTexte: { color: Colors.error, fontSize: 12, marginBottom: 8 },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 24, marginBottom: 16,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  lienConnexion: { alignItems: 'center', paddingVertical: 8 },
  lienTexte: { color: Colors.primary, fontSize: 15 },
});