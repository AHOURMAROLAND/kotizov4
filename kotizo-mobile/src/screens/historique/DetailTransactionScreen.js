import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../../utils/colors';

export default function DetailTransactionScreen({ navigation, route }) {
  const { transaction } = route.params || {};

  const operateursNoms = { mixx: 'Mixx by Yas', moov: 'Moov Money', tmoney: 'T-Money' };
  const statutCouleur = { success: Colors.success, failed: Colors.error, pending: Colors.warning, refunded: Colors.grey };

  const exporter = async () => {
    await Share.share({ message: `Transaction Kotizo\nMontant : ${transaction?.montant} FCFA\nStatut : ${transaction?.statut}` });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Detail transaction</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.montant}>{transaction?.montant} FCFA</Text>
        <View style={[styles.statutBadge, { backgroundColor: statutCouleur[transaction?.statut] + '20' }]}>
          <Text style={[styles.statutTexte, { color: statutCouleur[transaction?.statut] }]}>
            {transaction?.statut}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        {[
          ['Type', transaction?.type_transaction],
          ['Operateur', operateursNoms[transaction?.operateur] || transaction?.operateur],
          ['Telephone', transaction?.telephone],
          ['Reference', transaction?.reference_paydunya],
          ['Date', transaction?.date_creation ? new Date(transaction.date_creation).toLocaleDateString('fr-FR') : '-'],
        ].map(([label, valeur]) => (
          <View key={label} style={styles.ligne}>
            <Text style={styles.ligneLabel}>{label}</Text>
            <Text style={styles.ligneValeur}>{valeur || '-'}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btnExporter} onPress={exporter}>
        <Text style={styles.btnTexte}>Exporter le recu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  retour: { color: Colors.primary, fontSize: 16, marginBottom: 12 },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black },
  card: {
    alignItems: 'center', padding: 32,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder, gap: 12,
  },
  montant: { fontSize: 40, fontWeight: 'bold', color: Colors.black },
  statutBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  statutTexte: { fontSize: 14, fontWeight: '600' },
  details: { paddingHorizontal: 24 },
  ligne: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  ligneLabel: { fontSize: 14, color: Colors.grey },
  ligneValeur: { fontSize: 14, fontWeight: '600', color: Colors.black },
  btnExporter: {
    margin: 24, backgroundColor: Colors.primary,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});