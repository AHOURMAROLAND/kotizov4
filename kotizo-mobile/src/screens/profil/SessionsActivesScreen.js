import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/colors';

export default function SessionsActivesScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessions([
      { id: 1, appareil: 'iPhone 14', plateforme: 'iOS', date: 'Aujourd\'hui', actuel: true },
      { id: 2, appareil: 'Samsung Galaxy', plateforme: 'Android', date: 'Hier', actuel: false },
    ]);
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Sessions actives</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.liste}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.appareil}>{item.appareil}</Text>
                <Text style={styles.detail}>{item.plateforme} — {item.date}</Text>
                {item.actuel && <Text style={styles.actuel}>Session actuelle</Text>}
              </View>
              {!item.actuel && (
                <TouchableOpacity style={styles.btnDeconnecter}>
                  <Text style={styles.btnDeconnecterTexte}>Deconnecter</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.btnTout}>
        <Text style={styles.btnToutTexte}>Deconnecter tous les appareils</Text>
      </TouchableOpacity>
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
  liste: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, flexDirection: 'row', alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  appareil: { fontSize: 15, fontWeight: '600', color: Colors.black },
  detail: { fontSize: 13, color: Colors.grey, marginTop: 2 },
  actuel: { fontSize: 12, color: Colors.success, marginTop: 4 },
  btnDeconnecter: {
    backgroundColor: '#FEF2F2', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  btnDeconnecterTexte: { color: Colors.error, fontSize: 13 },
  btnTout: {
    margin: 16, backgroundColor: '#FEF2F2',
    paddingVertical: 14, borderRadius: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  btnToutTexte: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});