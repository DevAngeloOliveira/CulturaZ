import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '@/stores/auth.store';

import { AdminTabs } from './AdminTabs';
import { BuyerTabs } from './BuyerTabs';
import { PublicStack } from './PublicStack';
import { SellerTabs } from './SellerTabs';

const renderActiveStack = (
  isAuthenticated: boolean,
  activeRole: ReturnType<typeof useAuthStore.getState>['activeRole'],
) => {
  if (!isAuthenticated) return <PublicStack />;
  if (activeRole === 'ADMIN') return <AdminTabs />;
  if (activeRole === 'SELLER') return <SellerTabs />;
  return <BuyerTabs />;
};

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.activeRole);

  return <NavigationContainer>{renderActiveStack(isAuthenticated, activeRole)}</NavigationContainer>;
};
