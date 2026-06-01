import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  BookDetailsScreen,
  CartScreen,
  CheckoutScreen,
  FavoritesScreen,
  MarketplaceHomeScreen,
  OrderDetailsScreen,
  ReviewScreen,
} from '@/screens/buyer';

import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={MarketplaceHomeScreen} />
    <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="Review" component={ReviewScreen} />
  </Stack.Navigator>
);
