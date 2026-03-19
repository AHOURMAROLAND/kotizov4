import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import useAuthStore from '../../store/authStore';
import useCotisationStore from '../../store/cotisationStore';
import { Colors } from '../../utils/colors';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuthStore();
  const { cotisations, chargerCotisations, isLoading } = useCotisationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    chargerCotisations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerCotisations();
    setRefreshing(false);
  };

  const niveauCouleur = {
    basic: Colors.grey,
    verified: Colors.success,
    business: Colors.warning,
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.bonjour}>Bonjour, {user?.prenom}</Text>
          <View style={styles.niveauRow}>
            <View style={[styles.niveauBadge, { backgroundColor: niveauCouleur[user?.niveau] }]}>
              <Text style={styles.niveauTexte}>{user?.niveau?.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.avatarTexte}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* bandeaux verification */}
      {user && !user.email_verifie && (
        <View style={styles.bandeau}>
          <Text style={styles.bandeauTexte}>Verifiez votre email pour securiser votre compte</Text>
        </View>
      )}
      {user && !user.whatsapp_verifie && (
        <View style={styles.bandeau}>
          <Text style={styles.bandeauTexte}>Confirmez votre WhatsApp pour recevoir les notifications</Text>
        </View>
      )}

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNombre}>{cotisations.length}</Text>
            <Text style={styles.statLabel}>Cotisations actives</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNombre}>
              {cotisations.filter(c => c.createur?.id === user?.id).length}
            </Text>
            <Text style={styles.statLabel}>Mes cotisations</Text>
          </View>
        </View>

        {/* liste */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Cotisations actives</Text>
          {isLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
          ) : cotisations.length === 0 ? (
            <View style={styles.vide}>
              <Text style={styles.videTexte}>Aucune cotisation active</Text>
              <TouchableOpacity
                style={styles.btnCreer}
                onPress={() => navigation.navigate('CreerCotisation')}
              >
                <Text style={styles.btnCreerTexte}>Creer une cotisation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cotisations.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.cotisationCard}
                onPress={() => navigation.navigate('DetailCotisation', { slug: c.slug })}
              >
                <View style={styles.cotisationHeader}>
                  <Text style={styles.cotisationTitre}>{c.titre}</Text>
                  <Text style={styles.cotisationSlug}>{c.slug}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${Math.min((c.montant_collecte / c.montant_cible) * 100, 100)}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressTexte}>
                    {c.montant_collecte} / {c.montant_cible} FCFA
                  </Text>
                </View>
                <Text style={styles.membres}>
                  {c.nombre_participants} participant(s)
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* bouton flottant creer */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreerCotisation')}
      >
        <Text style={styles.fabTexte}>+</Text>
      </TouchableOpacity>

      {/* bouton flottant IA */}
      <TouchableOpacity
        style={styles.fabIA}
        onPress={() => navigation.navigate('AgentIA')}
      >
        <Text style={styles.fabIATexte}>IA</Text>
      </TouchableOpacity>
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
  bonjour: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  niveauRow: { flexDirection: 'row', marginTop: 4 },
  niveauBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8,
  },
  niveauTexte: { color: Colors.white, fontSize: 11, fontWeight: 'bold' },
  avatarBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  bandeau: {
    backgroundColor: '#FEF3C7', paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bandeauTexte: { color: '#92400E', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', gap: 12,
    padding: 16,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  statNombre: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.grey, marginTop: 4 },
  section: { paddingHorizontal: 16, paddingBottom: 100 },
  sectionTitre: { fontSize: 18, fontWeight: 'bold', color: Colors.black, marginBottom: 12 },
  cotisationCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 16, marginBottom: 12,
  },
  cotisationHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  cotisationTitre: { fontSize: 16, fontWeight: '600', color: Colors.black, flex: 1 },
  cotisationSlug: { fontSize: 12, color: Colors.grey },
  progressContainer: { marginBottom: 8 },
  progressBg: {
    height: 6, backgroundColor: Colors.greyBorder,
    borderRadius: 3, marginBottom: 6,
  },
  progressBar: {
    height: 6, backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressTexte: { fontSize: 12, color: Colors.grey },
  membres: { fontSize: 12, color: Colors.grey },
  vide: { alignItems: 'center', paddingVertical: 40 },
  videTexte: { fontSize: 15, color: Colors.grey, marginBottom: 16 },
  btnCreer: {
    backgroundColor: Colors.primary, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
  },
  btnCreerTexte: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 90, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  fabTexte: { color: Colors.white, fontSize: 28, fontWeight: 'bold' },
  fabIA: {
    position: 'absolute', bottom: 90, left: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  fabIATexte: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
});