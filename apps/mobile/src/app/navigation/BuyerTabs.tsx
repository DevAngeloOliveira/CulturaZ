import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { bottomTabScreenOptions, tabIcon } from '@/components/layout/BottomTabBar';
import { ActivateSellerScreen } from '@/screens/seller';

import { HomeStack } from './HomeStack';
import { OrdersStack } from './OrdersStack';
import { ProfileStack } from './ProfileStack';
import { SearchStack } from './SearchStack';
import type { BuyerTabParamList } from './types';

const Tab = createBottomTabNavigator<BuyerTabParamList>();

export const BuyerTabs = () => (
  <Tab.Navigator screenOptions={bottomTabScreenOptions}>
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{ tabBarLabel: 'Início', tabBarIcon: tabIcon('home') }}
    />
    <Tab.Screen
      name="SearchTab"
      component={SearchStack}
      options={{ tabBarLabel: 'Buscar', tabBarIcon: tabIcon('search') }}
    />
    <Tab.Screen
      name="SellTab"
      component={ActivateSellerScreen}
      options={{ tabBarLabel: 'Vender', tabBarIcon: tabIcon('add-circle') }}
    />
    <Tab.Screen
      name="OrdersTab"
      component={OrdersStack}
      options={{ tabBarLabel: 'Pedidos', tabBarIcon: tabIcon('cube') }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack}
      options={{ tabBarLabel: 'Perfil', tabBarIcon: tabIcon('person-circle') }}
    />
  </Tab.Navigator>
);
