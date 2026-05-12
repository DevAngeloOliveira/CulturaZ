import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '@/screens/public/ForgotPasswordScreen';
import { LoginScreen } from '@/screens/public/LoginScreen';
import { OnboardingScreen } from '@/screens/public/OnboardingScreen';
import { RegisterScreen } from '@/screens/public/RegisterScreen';
import { SplashScreen } from '@/screens/public/SplashScreen';

import type { PublicStackParamList } from './types';

const Stack = createNativeStackNavigator<PublicStackParamList>();

export const PublicStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}
  >
    <Stack.Screen name="Splash">
      {({ navigation }) => (
        <SplashScreen onFinish={() => navigation.replace('Onboarding')} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Onboarding">
      {({ navigation }) => (
        <OnboardingScreen onFinish={() => navigation.replace('Login')} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Login">
      {({ navigation }) => (
        <LoginScreen
          onNavigateToRegister={() => navigation.navigate('Register')}
          onNavigateToForgotPassword={() => navigation.navigate('ForgotPassword')}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {({ navigation }) => <RegisterScreen onBack={() => navigation.goBack()} />}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);
