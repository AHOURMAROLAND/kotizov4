import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function ProfilScreen({ navigation }) {
  const { user, deconnexion } = useAuthStore();

  const niveauCouleur = {
    basic: Colors.grey,
    verified: Colors.success,
    business: Colors.warning,
  };

  const menuItems = [
    { label: 'Modifier le profil', ecran: 'ModifierProfil', icone: '✏️' },
    { label: 'Securite', ecran: 'Securite', icone: '🔒' },
    { label: 'Notifications', ecran: 'CentreNotifications', icone: '🔔' },
    { label: 'Parametres', ecran: 'Parametres', icone: '⚙️' },
    { label: 'Verifier mon compte', ecran: 'VerificationRecto', icone: '✅' },
    { label: 'Business (bientot)', ecran: 'Business', icone: '🏢' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexte}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </Text>
        </View>
        <Text style={styles.nom}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.niveauBadge, { backgroundColor: niveauCouleur[user?.niveau] }]}>
          <Text style={styles.niveauTexte}>{user?.niveau?.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Creees</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Participees</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNombre}>0 F</Text>
            <Text style={styles.statLabel}>Total cotise</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.ecran}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.ecran)}
            >
              <Text style={styles.menuIcone}>{item.icone}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnDeconnexion}
          onPress={deconnexion}
        >
          <Text style={styles.btnDeconnexionTexte}>Se deconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.greyLight },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56, paddingBottom: 32,
    alignItems: 'center', gap: 8,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexte: { fontSize: 28, fontWeight: 'bold', color: Colors.white },
  nom: { fontSize: 20, fontWeight: 'bold', color: Colors.white },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  niveauBadge: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12,
  },
  niveauTexte: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },
  scroll: { paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 12, padding: 16 },
  statCard: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: 16, padding: 12, alignItems: 'center',
  },
  statNombre: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.grey, marginTop: 2 },
  menu: {
    backgroundColor: Colors.white, borderRadius: 16,
    marginHorizontal: 16, marginBottom: 16, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  menuIcone: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.black },
  menuChevron: { fontSize: 20, color: Colors.grey },
  btnDeconnexion: {
    marginHorizontal: 16, backgroundColor: '#FEF2F2',
    paddingVertical: 14, borderRadius: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  btnDeconnexionTexte: { color: Colors.error, fontSize: 15, fontWeight: '600' },
});