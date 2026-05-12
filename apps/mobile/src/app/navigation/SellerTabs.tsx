import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { bottomTabScreenOptions, tabIcon } from '@/components/layout/BottomTabBar';
import {
  MyListingsScreen,
  SellerDashboardScreen,
  SellerOrdersScreen,
  SellerReportScreen,
} from '@/screens/seller';

import type { SellerTabParamList } from './types';

const Tab = createBottomTabNavigator<SellerTabParamList>();

export const SellerTabs = () => (
  <Tab.Navigator screenOptions={bottomTabScreenOptions}>
    <Tab.Screen
      name="DashboardTab"
      component={SellerDashboardScreen}
      options={{ tabBarLabel: 'Painel', tabBarIcon: tabIcon('stats-chart') }}
    />
    <Tab.Screen
      name="ListingsTab"
      component={MyListingsScreen}
      options={{ tabBarLabel: 'Anúncios', tabBarIcon: tabIcon('albums') }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={SellerOrdersScreen}
      options={{ tabBarLabel: 'Pedidos', tabBarIcon: tabIcon('cube') }}
    />
    <Tab.Screen
      name="ReportsTab"
      component={SellerReportScreen}
      options={{ tabBarLabel: 'Relatórios', tabBarIcon: tabIcon('trending-up') }}
    />
  </Tab.Navigator>
);
