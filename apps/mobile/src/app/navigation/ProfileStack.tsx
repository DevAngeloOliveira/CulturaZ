import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddressesScreen, ProfileScreen } from '@/screens/buyer';

import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Addresses" component={AddressesScreen} />
  </Stack.Navigator>
);
