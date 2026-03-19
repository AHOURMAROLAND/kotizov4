import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import useCotisationStore from '../../store/cotisationStore';
import { Colors } from '../../utils/colors';

export default function CreerCotisationScreen({ navigation }) {
  const [form, setForm] = useState({
    titre: '', description: '',
    montant_cible: '', montant_par_membre: '',
    nombre_membres_max: '', date_limite: ''
  });
  const [erreurs, setErreurs] = useState({});
  const { creerCotisation, isLoading } = useCotisationStore();

  const valider = () => {
    const e = {};
    if (!form.titre) e.titre = 'Titre requis';
    if (!form.montant_cible || isNaN(form.montant_cible)) e.montant_cible = 'Montant invalide';
    if (!form.montant_par_membre || isNaN(form.montant_par_membre)) e.montant_par_membre = 'Montant invalide';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = () => {
    if (!valider()) return;
    navigation.navigate('ApercuCotisation', { form });
  };

  const champ = (key, label, props = {}) => (
    <View style={styles.champContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erreurs[key] && styles.inputErreur]}
        value={form[key]}
        onChangeText={v => setForm({ ...form, [key]: v })}
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Nouvelle cotisation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {champ('titre', 'Titre *', { placeholder: 'Ex: Cotisation mariage Roland' })}
        {champ('description', 'Description', {
          placeholder: 'Decrivez la cotisation...',
          multiline: true,
          numberOfLines: 3,
          style: [styles.input, styles.textarea]
        })}
        {champ('montant_cible', 'Montant cible (FCFA) *', {
          placeholder: '500000',
          keyboardType: 'numeric'
        })}
        {champ('montant_par_membre', 'Montant par membre (FCFA) *', {
          placeholder: '10000',
          keyboardType: 'numeric'
        })}
        {champ('nombre_membres_max', 'Nombre max de membres (optionnel)', {
          placeholder: '50',
          keyboardType: 'numeric'
        })}
        {champ('date_limite', 'Date limite (optionnel)', {
          placeholder: 'YYYY-MM-DD'
        })}

        <TouchableOpacity
          style={[styles.btnPrimaire, isLoading && styles.btnDesactive]}
          onPress={soumettre}
        >
          <Text style={styles.btnTexte}>Voir l'apercu</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  champContainer: { marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, backgroundColor: Colors.greyLight,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  inputErreur: { borderColor: Colors.error },
  erreurTexte: { color: Colors.error, fontSize: 12, marginTop: 4 },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 32,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});