import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontProvider } from '@/app/providers/FontProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { useAuthStore } from '@/stores/auth.store';

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <ThemeProvider>
          <FontProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </FontProvider>
        </ThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
