import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function ModifierProfilScreen({ navigation }) {
  const { user, chargerProfil } = useAuthStore();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
  });
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);

  const sauvegarder = async () => {
    setLoading(true);
    try {
      await api.patch('/auth/profil/', form);
      await chargerProfil();
      setSucces(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch {}
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Modifier le profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexte}>
              {form.prenom?.[0]}{form.nom?.[0]}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Prenom</Text>
        <TextInput
          style={styles.input}
          value={form.prenom}
          onChangeText={v => setForm({ ...form, prenom: v })}
          placeholderTextColor={Colors.grey}
        />

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={form.nom}
          onChangeText={v => setForm({ ...form, nom: v })}
          placeholderTextColor={Colors.grey}
        />

        <Text style={styles.champGrise}>Email : {user?.email} (non modifiable ici)</Text>
        <Text style={styles.champGrise}>WhatsApp : {user?.telephone_whatsapp} (non modifiable ici)</Text>

        {succes && (
          <View style={styles.succesBox}>
            <Text style={styles.succesTexte}>Profil mis a jour</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnSauvegarder, loading && styles.btnDesactive]}
          onPress={sauvegarder}
          disabled={loading}
        >
          <Text style={styles.btnTexte}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  retour: { color: Colors.grey, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarTexte: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
  },
  champGrise: { fontSize: 13, color: Colors.grey, marginTop: 12 },
  succesBox: {
    backgroundColor: '#DCFCE7', borderRadius: 12,
    padding: 12, marginTop: 16, alignItems: 'center',
  },
  succesTexte: { color: Colors.success, fontSize: 14, fontWeight: '600' },
  btnSauvegarder: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 32,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});