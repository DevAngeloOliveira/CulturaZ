import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '@/stores/auth.store';

import { AdminTabs } from './AdminTabs';
import { BuyerTabs } from './BuyerTabs';
import { PublicStack } from './PublicStack';
import { SellerTabs } from './SellerTabs';

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.activeRole);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <PublicStack />
      ) : activeRole === 'ADMIN' ? (
        <AdminTabs />
      ) : activeRole === 'SELLER' ? (
        <SellerTabs />
      ) : (
        <BuyerTabs />
      )}
    </NavigationContainer>
  );
};
