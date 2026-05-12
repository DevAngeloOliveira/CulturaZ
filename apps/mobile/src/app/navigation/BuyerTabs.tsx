import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { bottomTabScreenOptions, tabIcon } from '@/components/layout/BottomTabBar';
import {
  CatalogScreen,
  MarketplaceHomeScreen,
  MyOrdersScreen,
  ProfileScreen,
} from '@/screens/buyer';
import { ActivateSellerScreen } from '@/screens/seller';

import type { BuyerTabParamList } from './types';

const Tab = createBottomTabNavigator<BuyerTabParamList>();

export const BuyerTabs = () => (
  <Tab.Navigator screenOptions={bottomTabScreenOptions}>
    <Tab.Screen
      name="HomeTab"
      component={MarketplaceHomeScreen}
      options={{ tabBarLabel: 'Início', tabBarIcon: tabIcon('home') }}
    />
    <Tab.Screen
      name="SearchTab"
      component={CatalogScreen}
      options={{ tabBarLabel: 'Buscar', tabBarIcon: tabIcon('search') }}
    />
    <Tab.Screen
      name="SellTab"
      component={ActivateSellerScreen}
      options={{ tabBarLabel: 'Vender', tabBarIcon: tabIcon('add-circle') }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={MyOrdersScreen}
      options={{ tabBarLabel: 'Pedidos', tabBarIcon: tabIcon('cube') }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Perfil', tabBarIcon: tabIcon('person-circle') }}
    />
  </Tab.Navigator>
);
