import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AdminDashboardScreen,
  AdminOrderDetailsScreen,
  AdminOrdersScreen,
} from '@/screens/admin';

import type { AdminDashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<AdminDashboardStackParamList>();

export const AdminDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
    <Stack.Screen name="AdminOrderDetails" component={AdminOrderDetailsScreen} />
  </Stack.Navigator>
);
