import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function MesCotisationsScreen({ navigation }) {
  const [onglet, setOnglet] = useState('creees');
  const [data, setData] = useState({ creees: [], participees: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cotisations/mes-cotisations/')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const liste = onglet === 'creees' ? data.creees : data.participees;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Mes cotisations</Text>
      </View>

      <View style={styles.onglets}>
        {['creees', 'participees'].map(o => (
          <TouchableOpacity
            key={o}
            style={[styles.onglet, onglet === o && styles.ongletActif]}
            onPress={() => setOnglet(o)}
          >
            <Text style={[styles.ongletTexte, onglet === o && styles.ongletTexteActif]}>
              {o === 'creees' ? 'Creees' : 'Participees'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={liste}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.liste}
          ListEmptyComponent={
            <Text style={styles.vide}>Aucune cotisation</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DetailCotisation', {
                slug: onglet === 'creees' ? item.slug : item.cotisation?.slug
              })}
            >
              <Text style={styles.cardTitre}>
                {onglet === 'creees' ? item.titre : item.cotisation?.titre}
              </Text>
              <Text style={styles.cardMontant}>{item.montant} FCFA</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.greyLight },
  header: {
    backgroundColor: Colors.white, paddingTop: 56,
    paddingHorizontal: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  onglets: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  onglet: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  ongletActif: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  ongletTexte: { fontSize: 15, color: Colors.grey },
  ongletTexteActif: { color: Colors.primary, fontWeight: '600' },
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  cardTitre: { fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 4 },
  cardMontant: { fontSize: 14, color: Colors.primary },
  vide: { textAlign: 'center', color: Colors.grey, marginTop: 40, fontSize: 15 },
});