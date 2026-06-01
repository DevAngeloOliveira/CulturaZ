import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MyOrdersScreen, OrderDetailsScreen, ReviewScreen } from '@/screens/buyer';

import type { OrdersStackParamList } from './types';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="Review" component={ReviewScreen} />
  </Stack.Navigator>
);
