import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SellerDashboardScreen, SellerReputationScreen } from '@/screens/seller';

import type { SellerDashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<SellerDashboardStackParamList>();

export const SellerDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={SellerDashboardScreen} />
    <Stack.Screen name="Reputation" component={SellerReputationScreen} />
  </Stack.Navigator>
);
