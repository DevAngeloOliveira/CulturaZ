import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { colors } from '@/theme';

import { TextField } from './TextField';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof TextField>, 'secureTextEntry' | 'rightSlot'>;

export const PasswordField = (props: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightSlot={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      }
    />
  );
};
