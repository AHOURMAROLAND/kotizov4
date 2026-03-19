import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../utils/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const verifier = async () => {
      await new Promise(r => setTimeout(r, 2000));
      const onboardingFait = await AsyncStorage.getItem('onboarding_fait');
      const accessToken = await AsyncStorage.getItem('access_token');

      if (accessToken) {
        navigation.replace('MainTabs');
      } else if (onboardingFait) {
        navigation.replace('Auth');
      } else {
        navigation.replace('Onboarding');
      }
    };
    verifier();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>K.</Text>
        </View>
        <Text style={styles.appName}>Kotizo</Text>
        <Text style={styles.tagline}>Modern & Creative</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});