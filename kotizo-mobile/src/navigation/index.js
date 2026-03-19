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
import ReconfirmationMotDePasseScreen from '../screens/auth/ReconfirmationMotDePasseScreen';

// cotisations
import DashboardScreen from '../screens/cotisations/DashboardScreen';
import MesCotisationsScreen from '../screens/cotisations/MesCotisationsScreen';
import CreerCotisationScreen from '../screens/cotisations/CreerCotisationScreen';
import ApercuCotisationScreen from '../screens/cotisations/ApercuCotisationScreen';
import CotisationCreeeScreen from '../screens/cotisations/CotisationCreeeScreen';
import DetailCotisationScreen from '../screens/cotisations/DetailCotisationScreen';
import PayerCotisationScreen from '../screens/cotisations/PayerCotisationScreen';
import ChoixOperateurScreen from '../screens/cotisations/ChoixOperateurScreen';
import PaiementEnAttenteScreen from '../screens/cotisations/PaiementEnAttenteScreen';
import ConfirmationPaiementScreen from '../screens/cotisations/ConfirmationPaiementScreen';
import RejoindreScreen from '../screens/cotisations/RejoindreScreen';
import CelebrationScreen from '../screens/cotisations/CelebrationScreen';
import LimiteJournaliereScreen from '../screens/cotisations/LimiteJournaliereScreen';

// quickpay
import QuickPayScreen from '../screens/quickpay/QuickPayScreen';
import CreerQuickPayScreen from '../screens/quickpay/CreerQuickPayScreen';
import QuickPayGenereScreen from '../screens/quickpay/QuickPayGenereScreen';
import QuickPayAttenteScreen from '../screens/quickpay/QuickPayAttenteScreen';
import QuickPayExpireScreen from '../screens/quickpay/QuickPayExpireScreen';
import QuickPayConfirmationScreen from '../screens/quickpay/QuickPayConfirmationScreen';

// historique
import HistoriqueScreen from '../screens/historique/HistoriqueScreen';
import DetailTransactionScreen from '../screens/historique/DetailTransactionScreen';

// profil
import ProfilScreen from '../screens/profil/ProfilScreen';
import ModifierProfilScreen from '../screens/profil/ModifierProfilScreen';
import ChangerEmailScreen from '../screens/profil/ChangerEmailScreen';
import ChangerWhatsAppScreen from '../screens/profil/ChangerWhatsAppScreen';
import VerificationRectoScreen from '../screens/profil/VerificationRectoScreen';
import VerificationVersoScreen from '../screens/profil/VerificationVersoScreen';
import LivenessScreen from '../screens/profil/LivenessScreen';
import AttenteValidationScreen from '../screens/profil/AttenteValidationScreen';
import VerificationApprouveeScreen from '../screens/profil/VerificationApprouveeScreen';
import CentreNotificationsScreen from '../screens/profil/CentreNotificationsScreen';
import ParametresScreen from '../screens/profil/ParametresScreen';
import SecuriteScreen from '../screens/profil/SecuriteScreen';
import SessionsActivesScreen from '../screens/profil/SessionsActivesScreen';
import SupprimerCompteScreen from '../screens/profil/SupprimerCompteScreen';
import BusinessScreen from '../screens/profil/BusinessScreen';

// etats speciaux
import HorsLigneScreen from '../screens/etats/HorsLigneScreen';
import ErreurReseauScreen from '../screens/etats/ErreurReseauScreen';
import LienExpireScreen from '../screens/etats/LienExpireScreen';
import CotisationIntrouvableScreen from '../screens/etats/CotisationIntrouvableScreen';
import MaintenanceScreen from '../screens/etats/MaintenanceScreen';
import CompteSanctionneScreen from '../screens/etats/CompteSanctionneScreen';

// IA
import AgentIAScreen from '../screens/ia/AgentIAScreen';
import MicroDicteeScreen from '../screens/ia/MicroDicteeScreen';
import LimiteIAScreen from '../screens/ia/LimiteIAScreen';

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
      <Stack.Screen name="ReconfirmationMotDePasse" component={ReconfirmationMotDePasseScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* cotisations */}
      <Stack.Screen name="MesCotisations" component={MesCotisationsScreen} />
      <Stack.Screen name="CreerCotisation" component={CreerCotisationScreen} />
      <Stack.Screen name="ApercuCotisation" component={ApercuCotisationScreen} />
      <Stack.Screen name="CotisationCreee" component={CotisationCreeeScreen} />
      <Stack.Screen name="DetailCotisation" component={DetailCotisationScreen} />
      <Stack.Screen name="PayerCotisation" component={PayerCotisationScreen} />
      <Stack.Screen name="ChoixOperateur" component={ChoixOperateurScreen} />
      <Stack.Screen name="PaiementEnAttente" component={PaiementEnAttenteScreen} />
      <Stack.Screen name="ConfirmationPaiement" component={ConfirmationPaiementScreen} />
      <Stack.Screen name="Rejoindre" component={RejoindreScreen} />
      <Stack.Screen name="Celebration" component={CelebrationScreen} />
      <Stack.Screen name="LimiteJournaliere" component={LimiteJournaliereScreen} />

      {/* quickpay */}
      <Stack.Screen name="CreerQuickPay" component={CreerQuickPayScreen} />
      <Stack.Screen name="QuickPayGenere" component={QuickPayGenereScreen} />
      <Stack.Screen name="QuickPayAttente" component={QuickPayAttenteScreen} />
      <Stack.Screen name="QuickPayExpire" component={QuickPayExpireScreen} />
      <Stack.Screen name="QuickPayConfirmation" component={QuickPayConfirmationScreen} />

      {/* historique */}
      <Stack.Screen name="DetailTransaction" component={DetailTransactionScreen} />

      {/* profil */}
      <Stack.Screen name="ModifierProfil" component={ModifierProfilScreen} />
      <Stack.Screen name="ChangerEmail" component={ChangerEmailScreen} />
      <Stack.Screen name="ChangerWhatsApp" component={ChangerWhatsAppScreen} />
      <Stack.Screen name="VerificationRecto" component={VerificationRectoScreen} />
      <Stack.Screen name="VerificationVerso" component={VerificationVersoScreen} />
      <Stack.Screen name="Liveness" component={LivenessScreen} />
      <Stack.Screen name="AttenteValidation" component={AttenteValidationScreen} />
      <Stack.Screen name="VerificationApprouvee" component={VerificationApprouveeScreen} />
      <Stack.Screen name="CentreNotifications" component={CentreNotificationsScreen} />
      <Stack.Screen name="Parametres" component={ParametresScreen} />
      <Stack.Screen name="Securite" component={SecuriteScreen} />
      <Stack.Screen name="SessionsActives" component={SessionsActivesScreen} />
      <Stack.Screen name="SupprimerCompte" component={SupprimerCompteScreen} />
      <Stack.Screen name="Business" component={BusinessScreen} />
      <Stack.Screen name="ReconfirmationMotDePasse" component={ReconfirmationMotDePasseScreen} options={{ presentation: 'modal' }} />

      {/* etats speciaux */}
      <Stack.Screen name="HorsLigne" component={HorsLigneScreen} />
      <Stack.Screen name="ErreurReseau" component={ErreurReseauScreen} />
      <Stack.Screen name="LienExpire" component={LienExpireScreen} />
      <Stack.Screen name="CotisationIntrouvable" component={CotisationIntrouvableScreen} />
      <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
      <Stack.Screen name="CompteSanctione" component={CompteSanctionneScreen} />

      {/* IA */}
      <Stack.Screen name="AgentIA" component={AgentIAScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="MicroDictee" component={MicroDicteeScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="LimiteIA" component={LimiteIAScreen} options={{ presentation: 'modal' }} />
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
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}