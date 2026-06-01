import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SellerOrderDetailsScreen, SellerOrdersScreen } from '@/screens/seller';

import type { SellerOrdersStackParamList } from './types';

const Stack = createNativeStackNavigator<SellerOrdersStackParamList>();

export const SellerOrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} />
    <Stack.Screen name="SellerOrderDetails" component={SellerOrderDetailsScreen} />
  </Stack.Navigator>
);
