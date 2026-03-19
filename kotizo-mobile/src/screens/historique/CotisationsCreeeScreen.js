import React, { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function CotisationsCreeeScreen({ navigation }) {
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cotisations/mes-cotisations/')
      .then(r => setCotisations(r.data.creees))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={cotisations}
      keyExtractor={i => i.id.toString()}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={<Text style={styles.vide}>Aucune cotisation creee</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DetailCotisation', { slug: item.slug })}
        >
          <Text style={styles.titre}>{item.titre}</Text>
          <Text style={styles.slug}>{item.slug}</Text>
          <Text style={styles.info}>{item.montant_collecte} / {item.montant_cible} FCFA</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  titre: { fontSize: 16, fontWeight: '600', color: Colors.black, marginBottom: 4 },
  slug: { fontSize: 12, color: Colors.grey, marginBottom: 8 },
  info: { fontSize: 12, color: Colors.grey },
  vide: { textAlign: 'center', color: Colors.grey, marginTop: 40, fontSize: 15 },
});