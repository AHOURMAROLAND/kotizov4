import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import useCotisationStore from '../../store/cotisationStore';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function DetailCotisationScreen({ navigation, route }) {
  const { slug } = route.params;
  const { chargerCotisation, cotisationActuelle, isLoading } = useCotisationStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    chargerCotisation(slug);
  }, [slug]);

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerCotisation(slug);
    setRefreshing(false);
  };

  if (isLoading && !cotisationActuelle) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const c = cotisationActuelle;
  if (!c) return null;

  const progression = Math.min((c.montant_collecte / c.montant_cible) * 100, 100);
  const estCreateur = c.createur?.id === user?.id;
  const maParticipation = c.participations?.find(p => p.membre?.id === user?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.slug}>{c.slug}</Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.titre}>{c.titre}</Text>
          {c.description ? <Text style={styles.description}>{c.description}</Text> : null}

          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressBar, { width: `${progression}%` }]} />
            </View>
            <View style={styles.progressInfos}>
              <Text style={styles.montantCollecte}>{c.montant_collecte} FCFA</Text>
              <Text style={styles.montantCible}>sur {c.montant_cible} FCFA</Text>
            </View>
            <Text style={styles.progression}>{Math.round(progression)}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>
            Membres ({c.nombre_participants})
          </Text>
          {c.participations?.map(p => (
            <View key={p.id} style={styles.membreRow}>
              <View style={styles.membreAvatar}>
                <Text style={styles.membreInitiale}>
                  {p.membre?.prenom?.[0]}{p.membre?.nom?.[0]}
                </Text>
              </View>
              <Text style={styles.membreNom}>
                {p.membre?.prenom} {p.membre?.nom}
              </Text>
              <View style={[
                styles.statutBadge,
                p.statut === 'payee' ? styles.statutPaye : styles.statutAttente
              ]}>
                <Text style={styles.statutTexte}>
                  {p.statut === 'payee' ? 'Paye' : 'En attente'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {maParticipation?.statut === 'en_attente' && (
          <TouchableOpacity
            style={styles.btnPayer}
            onPress={() => navigation.navigate('PayerCotisation', { participation: maParticipation, cotisation: c })}
          >
            <Text style={styles.btnPayerTexte}>Payer {maParticipation.montant} FCFA</Text>
          </TouchableOpacity>
        )}

        {!maParticipation && !estCreateur && (
          <TouchableOpacity
            style={styles.btnRejoindre}
            onPress={() => navigation.navigate('Rejoindre', { slug: c.slug })}
          >
            <Text style={styles.btnRejoindreTexte}>Rejoindre</Text>
          </TouchableOpacity>
        )}

        {!estCreateur && (
          <TouchableOpacity style={styles.btnSignaler}>
            <Text style={styles.btnSignalerTexte}>Signaler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.greyLight },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: Colors.primary,
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
  },
  retour: { color: Colors.white, fontSize: 16 },
  slug: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  section: {
    backgroundColor: Colors.white, margin: 12,
    borderRadius: 16, padding: 16,
  },
  titre: { fontSize: 22, fontWeight: 'bold', color: Colors.black, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.grey, lineHeight: 20, marginBottom: 16 },
  progressContainer: { marginTop: 8 },
  progressBg: {
    height: 8, backgroundColor: Colors.greyBorder,
    borderRadius: 4, marginBottom: 8,
  },
  progressBar: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  progressInfos: { flexDirection: 'row', justifyContent: 'space-between' },
  montantCollecte: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  montantCible: { fontSize: 13, color: Colors.grey },
  progression: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  sectionTitre: { fontSize: 16, fontWeight: 'bold', color: Colors.black, marginBottom: 12 },
  membreRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  membreAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  membreInitiale: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  membreNom: { flex: 1, fontSize: 14, color: Colors.black },
  statutBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statutPaye: { backgroundColor: '#DCFCE7' },
  statutAttente: { backgroundColor: '#FEF3C7' },
  statutTexte: { fontSize: 12, fontWeight: '600' },
  footer: {
    backgroundColor: Colors.white, padding: 16,
    flexDirection: 'row', gap: 12,
    borderTopWidth: 1, borderTopColor: Colors.greyBorder,
  },
  btnPayer: {
    flex: 1, backgroundColor: Colors.primary,
    paddingVertical: 14, borderRadius: 14, alignItems: 'center',
  },
  btnPayerTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  btnRejoindre: {
    flex: 1, backgroundColor: Colors.primary,
    paddingVertical: 14, borderRadius: 14, alignItems: 'center',
  },
  btnRejoindreTexte: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  btnSignaler: {
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.error,
  },
  btnSignalerTexte: { color: Colors.error, fontSize: 15 },
});