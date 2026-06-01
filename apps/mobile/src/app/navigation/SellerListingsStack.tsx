import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CreateListingScreen, MyListingsScreen } from '@/screens/seller';

import type { SellerListingsStackParamList } from './types';

const Stack = createNativeStackNavigator<SellerListingsStackParamList>();

export const SellerListingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyListings" component={MyListingsScreen} />
    <Stack.Screen name="CreateListing" component={CreateListingScreen} />
  </Stack.Navigator>
);
