import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import useCotisationStore from '../../store/cotisationStore';
import { Colors } from '../../utils/colors';

export default function RejoindreScreen({ navigation, route }) {
  const slugInitial = route.params?.slug || '';
  const [slug, setSlug] = useState(slugInitial);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const { rejoindre, chargerCotisation } = useCotisationStore();

  const chercher = async () => {
    if (!slug) return;
    setLoading(true);
    setErreur('');
    try {
      const cotisation = await chargerCotisation(slug.toUpperCase());
      if (!cotisation) {
        setErreur('Cotisation introuvable');
      } else {
        navigation.navigate('DetailCotisation', { slug: cotisation.slug });
      }
    } catch {
      setErreur('Cotisation introuvable ou expiree');
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
        <Text style={styles.titre}>Rejoindre une cotisation</Text>
        <Text style={styles.sousTitre}>
          Saisissez le code KTZ-XXXXXX ou scannez le QR code
        </Text>
      </View>

      {erreur ? (
        <View style={styles.erreurBox}>
          <Text style={styles.erreurTexte}>{erreur}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Code de la cotisation</Text>
      <TextInput
        style={styles.input}
        value={slug}
        onChangeText={v => setSlug(v.toUpperCase())}
        placeholder="KTZ-XXXXXX"
        placeholderTextColor={Colors.grey}
        autoCapitalize="characters"
        maxLength={10}
      />

      <TouchableOpacity
        style={[styles.btnChercher, loading && styles.btnDesactive]}
        onPress={chercher}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={Colors.white} />
          : <Text style={styles.btnTexte}>Rechercher</Text>
        }
      </TouchableOpacity>
    </View>
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
    paddingVertical: 14, fontSize: 20,
    color: Colors.black, backgroundColor: Colors.greyLight,
    letterSpacing: 4, textAlign: 'center', marginBottom: 24,
  },
  btnChercher: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});