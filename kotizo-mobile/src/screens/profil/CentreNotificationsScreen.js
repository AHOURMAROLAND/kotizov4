import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function CentreNotificationsScreen({ navigation }) {
  const [prefs, setPrefs] = useState({
    paiements: true,
    rappels: true,
    systeme: true,
    whatsapp: true,
    email: true,
    push: true,
  });

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const Section = ({ titre, items }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitre}>{titre}</Text>
      {items.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Switch
            value={prefs[key]}
            onValueChange={() => toggle(key)}
            trackColor={{ false: Colors.greyBorder, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Notifications</Text>
      </View>

      <Section
        titre="Types de notifications"
        items={[
          { key: 'paiements', label: 'Paiements et recus' },
          { key: 'rappels', label: 'Rappels de cotisation' },
          { key: 'systeme', label: 'Notifications systeme' },
        ]}
      />
      <Section
        titre="Canaux"
        items={[
          { key: 'whatsapp', label: 'WhatsApp' },
          { key: 'email', label: 'Email' },
          { key: 'push', label: 'Notifications push' },
        ]}
      />
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
  section: {
    backgroundColor: Colors.white, marginTop: 16,
    marginHorizontal: 16, borderRadius: 16, overflow: 'hidden',
  },
  sectionTitre: {
    fontSize: 13, fontWeight: '600', color: Colors.grey,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: Colors.greyBorder,
  },
  rowLabel: { flex: 1, fontSize: 15, color: Colors.black },
});