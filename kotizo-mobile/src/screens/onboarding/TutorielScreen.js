import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../utils/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    titre: 'Cotisez ensemble',
    description: 'Creez et rejoignez des cotisations collectives en quelques secondes.',
    emoji: '🤝',
  },
  {
    id: '2',
    titre: 'Payez facilement',
    description: 'Mixx by Yas, Moov Money, T-Money — tous les operateurs du Togo.',
    emoji: '💳',
  },
  {
    id: '3',
    titre: 'Suivez en temps reel',
    description: 'Notifications WhatsApp, recus automatiques, historique complet.',
    emoji: '📲',
  },
];

export default function TutorielScreen({ navigation }) {
  const [indexActuel, setIndexActuel] = useState(0);
  const flatListRef = useRef(null);

  const suivant = () => {
    if (indexActuel < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: indexActuel + 1 });
      setIndexActuel(indexActuel + 1);
    } else {
      navigation.replace('CGU');
    }
  };

  const passer = () => {
    navigation.replace('CGU');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.passerBtn} onPress={passer}>
        <Text style={styles.passerText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndexActuel(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.titre}>{item.titre}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === indexActuel && styles.dotActif]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btnSuivant} onPress={suivant}>
          <Text style={styles.btnSuivantText}>
            {indexActuel === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  passerBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },
  passerText: {
    color: Colors.grey,
    fontSize: 16,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.greyBorder,
    marginHorizontal: 4,
  },
  dotActif: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  btnSuivant: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  btnSuivantText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});