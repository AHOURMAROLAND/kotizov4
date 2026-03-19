import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function SecuriteScreen({ navigation }) {
  const [form, setForm] = useState({
    ancien_password: '',
    nouveau_password: '',
    nouveau_password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const changerMdp = async () => {
    if (form.nouveau_password !== form.nouveau_password2) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setErreur('');
    try {
      await api.post('/auth/changer-mot-de-passe/', form);
      setSucces(true);
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Securite</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitre}>Changer le mot de passe</Text>

        {erreur ? (
          <View style={styles.erreurBox}>
            <Text style={styles.erreurTexte}>{erreur}</Text>
          </View>
        ) : null}

        {succes ? (
          <View style={styles.succesBox}>
            <Text style={styles.succesTexte}>Mot de passe modifie. Reconnectez-vous sur tous vos appareils.</Text>
          </View>
        ) : null}

        {[
          ['ancien_password', 'Mot de passe actuel'],
          ['nouveau_password', 'Nouveau mot de passe'],
          ['nouveau_password2', 'Confirmer le nouveau'],
        ].map(([key, label]) => (
          <View key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={v => setForm({ ...form, [key]: v })}
              placeholderTextColor={Colors.grey}
              secureTextEntry
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btnChanger, loading && styles.btnDesactive]}
          onPress={changerMdp}
          disabled={loading}
        >
          <Text style={styles.btnTexte}>
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </Text>
        </TouchableOpacity>

        <View style={styles.separateur} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SessionsActives')}
        >
          <Text style={styles.menuLabel}>Sessions actives</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuDanger]}
          onPress={() => navigation.navigate('SupprimerCompte')}
        >
          <Text style={styles.menuLabelDanger}>Supprimer mon compte</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitre: { fontSize: 16, fontWeight: '600', color: Colors.black, marginBottom: 16, marginTop: 8 },
  erreurBox: {
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA',
  },
  erreurTexte: { color: Colors.error, fontSize: 14 },
  succesBox: {
    backgroundColor: '#DCFCE7', borderRadius: 12,
    padding: 12, marginBottom: 16,
  },
  succesTexte: { color: Colors.success, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
  },
  btnChanger: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 24,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  separateur: { height: 1, backgroundColor: Colors.greyBorder, marginVertical: 24 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  menuDanger: { borderBottomWidth: 0 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.black },
  menuLabelDanger: { flex: 1, fontSize: 15, color: Colors.error },
  menuChevron: { fontSize: 20, color: Colors.grey },
});