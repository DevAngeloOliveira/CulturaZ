import type { LinkingOptions } from '@react-navigation/native';

/**
 * Placeholder de configuração de deep links.
 * TODO (entrega 2+): mapear rotas conforme fluxos públicos e autenticados.
 */
export const linking: LinkingOptions<Record<string, undefined>> = {
  prefixes: ['culturaz://', 'https://app.culturaz.dev'],
  config: {
    screens: {},
  },
};
