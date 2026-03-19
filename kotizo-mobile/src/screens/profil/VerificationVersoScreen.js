import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../utils/colors';

export default function VerificationVersoScreen({ navigation, route }) {
  const { photoRecto } = route.params || {};
  const [photo, setPhoto] = useState(null);

  const capturer = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8, allowsEditing: true, aspect: [4, 3],
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>CNI - Verso</Text>
        <Text style={styles.etape}>2/3</Text>
      </View>
      <View style={styles.guide}>
        <View style={styles.cadre}>
          {photo
            ? <Text style={styles.photoOk}>Photo capturee</Text>
            : <Text style={styles.guideTexte}>Placez le verso de votre CNI dans le cadre</Text>
          }
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnCapturer} onPress={capturer}>
          <Text style={styles.btnTexte}>{photo ? 'Reprendre' : 'Capturer'}</Text>
        </TouchableOpacity>
        {photo && (
          <TouchableOpacity
            style={styles.btnSuivant}
            onPress={() => navigation.navigate('Liveness', { photoRecto, photoVerso: photo })}
          >
            <Text style={styles.btnTexte}>Suivant</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
  },
  retour: { color: Colors.white, fontSize: 16 },
  titre: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  etape: { color: Colors.white, fontSize: 14 },
  guide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  cadre: {
    width: '100%', height: 200,
    borderWidth: 2, borderColor: Colors.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed',
  },
  guideTexte: { color: Colors.white, textAlign: 'center', fontSize: 14 },
  photoOk: { color: Colors.success, fontSize: 16, fontWeight: 'bold' },
  actions: { padding: 24, gap: 12 },
  btnCapturer: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnSuivant: {
    backgroundColor: Colors.success, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
  },
  btnTexte: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});