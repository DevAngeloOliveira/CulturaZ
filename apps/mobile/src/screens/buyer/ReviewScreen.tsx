import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { SelectChip } from '@/components/forms/SelectChip';
import { toast } from '@/components/feedback/Toast';
import { AppScreen } from '@/components/layout/AppScreen';
import { useCreateReviewMutation } from '@/hooks/api';
import { colors, radius, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';

type Route = RouteProp<{ Review: { orderId: string; sellerId: string } }, 'Review'>;

const SUGGESTED_TAGS = [
  'Entrega rápida',
  'Livro como descrito',
  'Bem embalado',
  'Boa comunicação',
  'Recomendo',
];

export const ReviewScreen = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { orderId, sellerId } = route.params;

  const createReview = useCreateReviewMutation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const onSubmit = () => {
    if (rating === 0) {
      Alert.alert('Escolha uma nota', 'Selecione de 1 a 5 estrelas para avaliar.');
      return;
    }
    createReview.mutate(
      {
        orderId,
        sellerId,
        rating,
        comment: comment.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Avaliação enviada. Obrigado!');
          navigation.goBack();
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Avaliar</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Como foi sua experiência?</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)} hitSlop={6}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={colors.accent}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>O que mais se destacou?</Text>
          <View style={styles.tags}>
            {SUGGESTED_TAGS.map((tag) => (
              <SelectChip
                key={tag}
                label={tag}
                selected={tags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Comentário (opcional)</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Conte como foi a compra…"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={5}
            style={styles.textarea}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.counter}>{comment.length}/500</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Enviar avaliação"
          fullWidth
          loading={createReview.isPending}
          disabled={rating === 0}
          onPress={onSubmit}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  spacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  textarea: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    minHeight: 110,
    ...typography.body,
    color: colors.textPrimary,
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
