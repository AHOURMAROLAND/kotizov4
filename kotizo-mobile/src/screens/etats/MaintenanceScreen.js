import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colors';

export default function MaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>🔧</Text>
      <Text style={styles.titre}>Maintenance en cours</Text>
      <Text style={styles.sousTitre}>
        Kotizo est temporairement indisponible.{'\n'}Revenez dans quelques minutes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icone: { fontSize: 64, marginBottom: 16 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  sousTitre: { fontSize: 15, color: Colors.grey, textAlign: 'center', lineHeight: 24 },
});