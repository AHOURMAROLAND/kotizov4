import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';
import CotisationsCreeeScreen from './CotisationsCreeeScreen';
import CotisationsParticipeesScreen from './CotisationsParticipeesScreen';
import QuickPayEnvoyesScreen from './QuickPayEnvoyesScreen';
import QuickPayRecusScreen from './QuickPayRecusScreen';

const ONGLETS = [
  { id: 'creees', label: 'Creees' },
  { id: 'participees', label: 'Participees' },
  { id: 'qp_envoyes', label: 'QP Envoyes' },
  { id: 'qp_recus', label: 'QP Recus' },
];

export default function HistoriqueScreen({ navigation }) {
  const [onglet, setOnglet] = useState('creees');

  const renderContenu = () => {
    switch (onglet) {
      case 'creees': return <CotisationsCreeeScreen navigation={navigation} />;
      case 'participees': return <CotisationsParticipeesScreen navigation={navigation} />;
      case 'qp_envoyes': return <QuickPayEnvoyesScreen navigation={navigation} />;
      case 'qp_recus': return <QuickPayRecusScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Historique</Text>
      </View>
      <View style={styles.onglets}>
        {ONGLETS.map(o => (
          <TouchableOpacity
            key={o.id}
            style={[styles.onglet, onglet === o.id && styles.ongletActif]}
            onPress={() => setOnglet(o.id)}
          >
            <Text style={[styles.ongletTexte, onglet === o.id && styles.ongletTexteActif]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.greyLight },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 24,
  },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  onglets: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  onglet: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  ongletActif: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  ongletTexte: { fontSize: 12, color: Colors.grey },
  ongletTexteActif: { color: Colors.primary, fontWeight: '600' },
});