import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/colors';

export default function LimiteJournaliereScreen({ navigation, route }) {
  const { count, limite, niveau } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>🔒</Text>
      </View>

      <Text style={styles.titre}>Limite journaliere atteinte</Text>
      <Text style={styles.sousTitre}>
        {count || 0} cotisations creees aujourd'hui
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitre}>Votre niveau : {niveau || 'Basique'}</Text>
        <Text style={styles.infoTexte}>
          Limite : {limite || 5} cotisations par jour
        </Text>
      </View>

      <View style={styles.upgradeBox}>
        <Text style={styles.upgradeTitre}>Passez au niveau Verifie</Text>
        <Text style={styles.upgradeTexte}>
          20 cotisations par jour, 25 messages IA, badge verifie
        </Text>
        <TouchableOpacity
          style={styles.btnUpgrade}
          onPress={() => navigation.navigate('VerificationRecto')}
        >
          <Text style={styles.btnUpgradeTexte}>Verifier mon compte — 1000 FCFA</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.lienRetour}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.lienTexte}>Retour a l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.white,
    padding: 24, alignItems: 'center', justifyContent: 'center',
  },
  iconeContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  icone: { fontSize: 40 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8, textAlign: 'center' },
  sousTitre: { fontSize: 15, color: Colors.grey, marginBottom: 24 },
  infoBox: {
    backgroundColor: Colors.greyLight, borderRadius: 16,
    padding: 16, width: '100%', marginBottom: 16,
  },
  infoTitre: { fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 4 },
  infoTexte: { fontSize: 14, color: Colors.grey },
  upgradeBox: {
    backgroundColor: Colors.primaryLight, borderRadius: 16,
    padding: 16, width: '100%', marginBottom: 24,
  },
  upgradeTitre: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  upgradeTexte: { fontSize: 13, color: Colors.grey, marginBottom: 12 },
  btnUpgrade: {
    backgroundColor: Colors.primary, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center',
  },
  btnUpgradeTexte: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
  lienRetour: { paddingVertical: 8 },
  lienTexte: { color: Colors.grey, fontSize: 15 },
});