import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function CotisationsParticipeesScreen({ navigation }) {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cotisations/mes-cotisations/')
      .then(r => setParticipations(r.data.participees))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={participations}
      keyExtractor={i => i.id.toString()}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={<Text style={styles.vide}>Aucune participation</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DetailCotisation', { slug: item.cotisation?.slug })}
        >
          <View style={styles.row}>
            <Text style={styles.titre}>{item.cotisation?.titre}</Text>
            <View style={[
              styles.badge,
              { backgroundColor: item.statut === 'payee' ? '#DCFCE7' : '#FEF3C7' }
            ]}>
              <Text style={[
                styles.badgeTexte,
                { color: item.statut === 'payee' ? Colors.success : Colors.warning }
              ]}>
                {item.statut === 'payee' ? 'Paye' : 'En attente'}
              </Text>
            </View>
          </View>
          <Text style={styles.montant}>{item.montant} FCFA</Text>
          {item.date_paiement && (
            <Text style={styles.date}>
              {new Date(item.date_paiement).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titre: { fontSize: 15, fontWeight: '600', color: Colors.black, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTexte: { fontSize: 12, fontWeight: '600' },
  montant: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  date: { fontSize: 12, color: Colors.grey },
  vide: { textAlign: 'center', color: Colors.grey, marginTop: 40, fontSize: 15 },
});