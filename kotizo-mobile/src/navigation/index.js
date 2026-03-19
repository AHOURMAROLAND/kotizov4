import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import useAuthStore from '../store/authStore';
import { Colors } from '../utils/colors';

// onboarding
import SplashScreen from '../screens/onboarding/SplashScreen';
import TutorielScreen from '../screens/onboarding/TutorielScreen';
import CGUScreen from '../screens/onboarding/CGUScreen';
import PolitiqueScreen from '../screens/onboarding/PolitiqueScreen';

// auth
import ConnexionScreen from '../screens/auth/ConnexionScreen';
import InscriptionScreen from '../screens/auth/InscriptionScreen';
import ChoixCanalScreen from '../screens/auth/ChoixCanalScreen';
import VerificationEnCoursScreen from '../screens/auth/VerificationEnCoursScreen';
import MotDePasseOublieScreen from '../screens/auth/MotDePasseOublieScreen';
import ReinitialisationScreen from '../screens/auth/ReinitialisationScreen';
import CompteBlockeScreen from '../screens/auth/CompteBlockeScreen';
import ActivationBiometrieScreen from '../screens/auth/ActivationBiometrieScreen';
import ConnexionBiometrieScreen from '../screens/auth/ConnexionBiometrieScreen';

// main tabs
import DashboardScreen from '../screens/cotisations/DashboardScreen';
import QuickPayScreen from '../screens/quickpay/QuickPayScreen';
import HistoriqueScreen from '../screens/historique/HistoriqueScreen';
import ProfilScreen from '../screens/profil/ProfilScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: { borderTopColor: Colors.greyBorder },
        tabBarLabel: ({ color }) => {
          const labels = {
            Dashboard: 'Accueil',
            QuickPay: 'QuickPay',
            Historique: 'Historique',
            Profil: 'Profil',
          };
          return <Text style={{ color, fontSize: 11 }}>{labels[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="QuickPay" component={QuickPayScreen} />
      <Tab.Screen name="Historique" component={HistoriqueScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connexion" component={ConnexionScreen} />
      <Stack.Screen name="Inscription" component={InscriptionScreen} />
      <Stack.Screen name="ChoixCanal" component={ChoixCanalScreen} />
      <Stack.Screen name="VerificationEnCours" component={VerificationEnCoursScreen} />
      <Stack.Screen name="MotDePasseOublie" component={MotDePasseOublieScreen} />
      <Stack.Screen name="Reinitialisation" component={ReinitialisationScreen} />
      <Stack.Screen name="CompteBloque" component={CompteBlockeScreen} />
      <Stack.Screen name="ActivationBiometrie" component={ActivationBiometrieScreen} />
      <Stack.Screen name="ConnexionBiometrie" component={ConnexionBiometrieScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={TutorielScreen} />
        <Stack.Screen name="CGU" component={CGUScreen} />
        <Stack.Screen name="Politique" component={PolitiqueScreen} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}