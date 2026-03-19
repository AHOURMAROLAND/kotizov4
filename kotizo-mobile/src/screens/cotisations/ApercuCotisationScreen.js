import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useCotisationStore from '../../store/cotisationStore';
import { Colors } from '../../utils/colors';

export default function ApercuCotisationScreen({ navigation, route }) {
  const { form } = route.params;
  const { creerCotisation, isLoading } = useCotisationStore();

  const confirmer = async () => {
    const res = await creerCotisation(form);
    if (res.succes) {
      navigation.replace('CotisationCreee', { cotisation: res.cotisation });
    } else if (res.code === 'limite_atteinte') {
      navigation.replace('LimiteJournaliere');
    }
  };

  const ligne = (label, valeur) => (
    <View style={styles.ligne}>
      <Text style={styles.ligneLabel}>{label}</Text>
      <Text style={styles.ligneValeur}>{valeur || '-'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Modifier</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Apercu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {ligne('Titre', form.titre)}
          {ligne('Description', form.description)}
          {ligne('Montant cible', `${form.montant_cible} FCFA`)}
          {ligne('Montant par membre', `${form.montant_par_membre} FCFA`)}
          {ligne('Membres max', form.nombre_membres_max || 'Illimite')}
          {ligne('Date limite', form.date_limite || 'Aucune')}
        </View>

        <Text style={styles.info}>
          Un code unique KTZ-XXXXXX sera genere automatiquement
        </Text>

        <TouchableOpacity
          style={[styles.btnPrimaire, isLoading && styles.btnDesactive]}
          onPress={confirmer}
          disabled={isLoading}
        >
          <Text style={styles.btnTexte}>
            {isLoading ? 'Creation...' : 'Confirmer et creer'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16 },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: Colors.black },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.greyLight, borderRadius: 16,
    padding: 16, marginBottom: 16,
  },
  ligne: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  ligneLabel: { fontSize: 14, color: Colors.grey },
  ligneValeur: { fontSize: 14, fontWeight: '600', color: Colors.black, flex: 1, textAlign: 'right' },
  info: { color: Colors.grey, fontSize: 13, textAlign: 'center', marginBottom: 24 },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});