import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

export default function QuickPayRecusScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/paiements/quickpay/mes/')
      .then(r => setItems(r.data.recus))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={items}
      keyExtractor={i => i.id.toString()}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={<Text style={styles.vide}>Aucun QuickPay recu</Text>}
      renderItem={({ item }) => (
        <Text style={styles.item}>{item.montant} FCFA — {item.statut}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  liste: { padding: 16, gap: 12 },
  item: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, fontSize: 15, color: Colors.black },
  vide: { textAlign: 'center', color: Colors.grey, marginTop: 40, fontSize: 15 },
});