import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { Colors } from '../../utils/colors';

export default function ConnexionScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { connexion, isLoading, error, reinitialiserErreur } = useAuthStore();

  const handleConnexion = async () => {
    if (!email || !password) return;
    reinitialiserErreur();
    const res = await connexion(email, password);
    if (res.succes) {
      navigation.replace('ActivationBiometrie');
    } else if (res.code === 'bloque') {
      navigation.navigate('CompteBloque');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>K.</Text>
          </View>
          <Text style={styles.titre}>Connexion</Text>
          <Text style={styles.sousTitre}>Bienvenue sur Kotizo</Text>
        </View>

        {error ? (
          <View style={styles.erreurBox}>
            <Text style={styles.erreurTexte}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            placeholderTextColor={Colors.grey}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor={Colors.grey}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? 'Cacher' : 'Voir'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.oublie}
            onPress={() => navigation.navigate('MotDePasseOublie')}
          >
            <Text style={styles.oublieText}>Mot de passe oublie ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPrimaire, isLoading && styles.btnDesactive]}
            onPress={handleConnexion}
            disabled={isLoading}
          >
            <Text style={styles.btnTexte}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <View style={styles.separateur}>
            <View style={styles.ligne} />
            <Text style={styles.separateurTexte}>ou</Text>
            <View style={styles.ligne} />
          </View>

          <TouchableOpacity
            style={styles.btnSecondaire}
            onPress={() => navigation.navigate('Inscription')}
          >
            <Text style={styles.btnSecondaireTexte}>Creer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 64, paddingBottom: 32 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: Colors.white },
  titre: { fontSize: 26, fontWeight: 'bold', color: Colors.black, marginBottom: 4 },
  sousTitre: { fontSize: 15, color: Colors.grey },
  erreurBox: {
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  erreurTexte: { color: Colors.error, fontSize: 14 },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    color: Colors.black, marginBottom: 16,
    backgroundColor: Colors.greyLight,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  eyeBtn: { position: 'absolute', right: 16, top: 14 },
  eyeText: { color: Colors.primary, fontSize: 13 },
  oublie: { alignSelf: 'flex-end', marginBottom: 24 },
  oublieText: { color: Colors.primary, fontSize: 14 },
  btnPrimaire: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginBottom: 16,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  separateur: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ligne: { flex: 1, height: 1, backgroundColor: Colors.greyBorder },
  separateurTexte: { marginHorizontal: 12, color: Colors.grey, fontSize: 14 },
  btnSecondaire: {
    borderWidth: 1.5, borderColor: Colors.primary,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
  },
  btnSecondaireTexte: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
});