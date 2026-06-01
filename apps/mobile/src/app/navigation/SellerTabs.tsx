import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { bottomTabScreenOptions, tabIcon } from '@/components/layout/BottomTabBar';
import { SellerReportScreen } from '@/screens/seller';

import { SellerDashboardStack } from './SellerDashboardStack';
import { SellerListingsStack } from './SellerListingsStack';
import { SellerOrdersStack } from './SellerOrdersStack';
import type { SellerTabParamList } from './types';

const Tab = createBottomTabNavigator<SellerTabParamList>();

export const SellerTabs = () => (
  <Tab.Navigator screenOptions={bottomTabScreenOptions}>
    <Tab.Screen
      name="DashboardTab"
      component={SellerDashboardStack}
      options={{ tabBarLabel: 'Painel', tabBarIcon: tabIcon('stats-chart') }}
    />
    <Tab.Screen
      name="ListingsTab"
      component={SellerListingsStack}
      options={{ tabBarLabel: 'Anúncios', tabBarIcon: tabIcon('albums') }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={SellerOrdersStack}
      options={{ tabBarLabel: 'Pedidos', tabBarIcon: tabIcon('cube') }}
    />
    <Tab.Screen
      name="ReportsTab"
      component={SellerReportScreen}
      options={{ tabBarLabel: 'Relatórios', tabBarIcon: tabIcon('trending-up') }}
    />
  </Tab.Navigator>
);
