import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function ParametresScreen({ navigation }) {
  const [biometrie, setBiometrie] = useState(false);
  const [theme, setTheme] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Parametres</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Theme sombre</Text>
          <Switch
            value={theme}
            onValueChange={setTheme}
            trackColor={{ false: Colors.greyBorder, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Connexion biometrique</Text>
          <Switch
            value={biometrie}
            onValueChange={setBiometrie}
            trackColor={{ false: Colors.greyBorder, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Langue</Text>
          <Text style={styles.rowValeur}>Francais</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValeur}>1.0.0</Text>
        </View>
      </View>
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
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  rowLabel: { flex: 1, fontSize: 15, color: Colors.black },
  rowValeur: { fontSize: 14, color: Colors.grey },
});