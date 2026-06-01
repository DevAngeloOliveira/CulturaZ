import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookDetailsScreen, CatalogScreen, FiltersScreen } from '@/screens/buyer';

import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Catalog" component={CatalogScreen} />
    <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
    <Stack.Screen
      name="Filters"
      component={FiltersScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);
