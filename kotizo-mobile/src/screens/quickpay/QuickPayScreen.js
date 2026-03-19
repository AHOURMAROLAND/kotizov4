import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function QuickPayScreen({ navigation }) {
  const [onglet, setOnglet] = useState('envoyes');
  const [data, setData] = useState({ envoyes: [], recus: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const res = await api.get('/paiements/quickpay/mes/');
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await charger();
    setRefreshing(false);
  };

  const statutCouleur = { en_attente: Colors.warning, paye: Colors.success, expire: Colors.grey };
  const statutLabel = { en_attente: 'En attente', paye: 'Paye', expire: 'Expire' };

  const liste = onglet === 'envoyes' ? data.envoyes : data.recus;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>QuickPay</Text>
        <TouchableOpacity
          style={styles.btnNouveauQP}
          onPress={() => navigation.navigate('CreerQuickPay')}
        >
          <Text style={styles.btnNouveauQPTexte}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.onglets}>
        {['envoyes', 'recus'].map(o => (
          <TouchableOpacity
            key={o}
            style={[styles.onglet, onglet === o && styles.ongletActif]}
            onPress={() => setOnglet(o)}
          >
            <Text style={[styles.ongletTexte, onglet === o && styles.ongletTexteActif]}>
              {o === 'envoyes' ? 'Envoyes' : 'Recus'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={liste}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.liste}
          ListEmptyComponent={
            <View style={styles.vide}>
              <Text style={styles.videTexte}>Aucun QuickPay</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.montant}>{item.montant} FCFA</Text>
                <View style={[styles.statutBadge, { backgroundColor: statutCouleur[item.statut] + '20' }]}>
                  <Text style={[styles.statutTexte, { color: statutCouleur[item.statut] }]}>
                    {statutLabel[item.statut]}
                  </Text>
                </View>
              </View>
              {item.message ? <Text style={styles.message}>{item.message}</Text> : null}
              <Text style={styles.date}>
                {new Date(item.date_creation).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.greyLight },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: Colors.primary,
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 24,
  },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  btnNouveauQP: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  btnNouveauQPTexte: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  onglets: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  onglet: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  ongletActif: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  ongletTexte: { fontSize: 15, color: Colors.grey },
  ongletTexteActif: { color: Colors.primary, fontWeight: '600' },
  liste: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  montant: { fontSize: 18, fontWeight: 'bold', color: Colors.black },
  statutBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statutTexte: { fontSize: 12, fontWeight: '600' },
  message: { fontSize: 14, color: Colors.grey, marginBottom: 6 },
  date: { fontSize: 12, color: Colors.grey },
  vide: { alignItems: 'center', paddingVertical: 60 },
  videTexte: { fontSize: 15, color: Colors.grey },
});