import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import useAuthStore from "../store/authStore";

import SplashScreen from "../screens/onboarding/SplashScreen";
import TutorielScreen from "../screens/onboarding/TutorielScreen";
import CGUScreen from "../screens/onboarding/CGUScreen";
import PolitiqueScreen from "../screens/onboarding/PolitiqueScreen";

import ConnexionScreen from "../screens/auth/ConnexionScreen";
import InscriptionScreen from "../screens/auth/InscriptionScreen";
import ChoixCanalScreen from "../screens/auth/ChoixCanalScreen";
import VerificationEnCoursScreen from "../screens/auth/VerificationEnCoursScreen";
import MotDePasseOublieScreen from "../screens/auth/MotDePasseOublieScreen";
import ReinitialisationScreen from "../screens/auth/ReinitialisationScreen";
import CompteBlockeScreen from "../screens/auth/CompteBlockeScreen";
import ActivationBiometrieScreen from "../screens/auth/ActivationBiometrieScreen";
import ConnexionBiometrieScreen from "../screens/auth/ConnexionBiometrieScreen";

import DashboardScreen from "../screens/cotisations/DashboardScreen";
import ProfilScreen from "../screens/profil/ProfilScreen";
import QuickPayScreen from "../screens/quickpay/QuickPayScreen";
import HistoriqueScreen from "../screens/historique/HistoriqueScreen";
import AgentIAScreen from "../screens/ia/AgentIAScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="QuickPay" component={QuickPayScreen} />
      <Tab.Screen name="Historique" component={HistoriqueScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tutoriel" component={TutorielScreen} />
      <Stack.Screen name="CGU" component={CGUScreen} />
      <Stack.Screen name="Politique" component={PolitiqueScreen} />
    </Stack.Navigator>
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
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
        <Stack.Screen name="Auth" component={AuthStack} />
        {isAuthenticated && (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="AgentIA" component={AgentIAScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
