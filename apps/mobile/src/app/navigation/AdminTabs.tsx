import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { bottomTabScreenOptions, tabIcon } from '@/components/layout/BottomTabBar';
import {
  AdminCategoriesScreen,
  AdminDashboardScreen,
  AdminModerationScreen,
  AdminReportsScreen,
  AdminUsersScreen,
} from '@/screens/admin';

import type { AdminTabParamList } from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabs = () => (
  <Tab.Navigator screenOptions={bottomTabScreenOptions}>
    <Tab.Screen
      name="DashboardTab"
      component={AdminDashboardScreen}
      options={{ tabBarLabel: 'Painel', tabBarIcon: tabIcon('grid') }}
    />
    <Tab.Screen
      name="UsersTab"
      component={AdminUsersScreen}
      options={{ tabBarLabel: 'Usuários', tabBarIcon: tabIcon('people') }}
    />
    <Tab.Screen
      name="ModerationTab"
      component={AdminModerationScreen}
      options={{ tabBarLabel: 'Moderar', tabBarIcon: tabIcon('shield-checkmark') }}
    />
    <Tab.Screen
      name="CategoriesTab"
      component={AdminCategoriesScreen}
      options={{ tabBarLabel: 'Categorias', tabBarIcon: tabIcon('pricetags') }}
    />
    <Tab.Screen
      name="ReportsTab"
      component={AdminReportsScreen}
      options={{ tabBarLabel: 'Relatórios', tabBarIcon: tabIcon('bar-chart') }}
    />
  </Tab.Navigator>
);
