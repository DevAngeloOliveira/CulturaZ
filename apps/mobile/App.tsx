import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontProvider } from '@/app/providers/FontProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </FontProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
