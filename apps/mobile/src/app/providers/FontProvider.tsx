import {
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  useFonts as useFraunces,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import type { ReactNode } from 'react';

import { LoadingState } from '@/components/feedback/LoadingState';

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider = ({ children }: FontProviderProps) => {
  const [fraunces] = useFraunces({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
  });
  const [inter] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fraunces || !inter) {
    return <LoadingState message="Carregando tipografia" />;
  }

  return <>{children}</>;
};
