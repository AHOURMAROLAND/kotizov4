import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../utils/colors';

const CGU_TEXTE = `
CONDITIONS GENERALES D'UTILISATION — KOTIZO

1. OBJET
Kotizo est une application mobile de gestion de cotisations collectives. En utilisant Kotizo, vous acceptez les presentes conditions.

2. COMPTE UTILISATEUR
Vous devez fournir des informations exactes lors de la creation de votre compte. Vous etes responsable de la securite de vos identifiants.

3. PAIEMENTS
Les paiements sont traites par PayDunya. Kotizo ne stocke pas vos informations bancaires. Les frais de transaction sont a la charge de l'utilisateur.

4. COTISATIONS
Le createur d'une cotisation est responsable de sa gestion. Kotizo n'est pas responsable des litiges entre membres.

5. SIGNALEMENTS
Tout contenu inapproprie peut etre signale. 3 signalements entrainent la suspension automatique d'une cotisation.

6. DONNÉES PERSONNELLES
Vos donnees sont traitees conformement a notre politique de confidentialite. Nous ne vendons pas vos donnees a des tiers.

7. RESPONSABILITE
Kotizo ne peut etre tenu responsable des pertes financieres resultant d'une utilisation frauduleuse de l'application.

8. MODIFICATION
Ces CGU peuvent etre modifiees a tout moment. Vous serez notifie des changements importants.

En acceptant, vous confirmez avoir lu et compris ces conditions.
`;

export default function CGUScreen({ navigation }) {
  const [peutAccepter, setPeutAccepter] = useState(false);
  const scrollRef = useRef(null);

  const accepter = async () => {
    await AsyncStorage.setItem('onboarding_fait', 'true');
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Conditions d'utilisation</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Politique')}>
          <Text style={styles.lienPolitique}>Politique de confidentialite</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const enBas = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
          if (enBas) setPeutAccepter(true);
        }}
        scrollEventThrottle={16}
      >
        <Text style={styles.texte}>{CGU_TEXTE}</Text>
      </ScrollView>

      {!peutAccepter && (
        <Text style={styles.indiceScroll}>Faites defiler pour lire les conditions</Text>
      )}

      <TouchableOpacity
        style={[styles.btnAccepter, !peutAccepter && styles.btnDesactive]}
        onPress={peutAccepter ? accepter : null}
      >
        <Text style={styles.btnTexte}>Accepter et continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBorder,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  lienPolitique: {
    color: Colors.primary,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  texte: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    paddingVertical: 16,
  },
  indiceScroll: {
    textAlign: 'center',
    color: Colors.grey,
    fontSize: 13,
    paddingVertical: 8,
  },
  btnAccepter: {
    margin: 24,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnDesactive: {
    backgroundColor: Colors.greyBorder,
  },
  btnTexte: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});