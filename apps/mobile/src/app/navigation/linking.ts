import type { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<Record<string, undefined>> = {
  prefixes: ['culturaz://', 'https://app.culturaz.dev'],
  config: {
    screens: {},
  },
};
