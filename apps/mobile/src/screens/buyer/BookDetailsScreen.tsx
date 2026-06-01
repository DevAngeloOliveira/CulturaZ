import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Badge } from '@/components/feedback/Badge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { toast } from '@/components/feedback/Toast';
import { AppScreen } from '@/components/layout/AppScreen';
import {
  useAddCartItemMutation,
  useAddFavoriteMutation,
  useFavoritesQuery,
  useListingQuery,
  useRemoveFavoriteMutation,
} from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';
import { discountPercent, formatBRL, formatCondition, formatRating } from '@/utils/format';

import type { SearchStackParamList } from '@/app/navigation/types';

const SELLER_TYPE_LABEL = {
  INDIVIDUAL: 'Vendedor individual',
  BOOKSTORE: 'Livraria',
  SEBO: 'Sebo',
} as const;

export const BookDetailsScreen = () => {
  const route = useRoute<RouteProp<SearchStackParamList, 'BookDetails'>>();
  const navigation = useNavigation();
  const { listingId } = route.params;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const listingQuery = useListingQuery(listingId);
  const favoritesQuery = useFavoritesQuery(isAuthenticated);
  const addFavorite = useAddFavoriteMutation();
  const removeFavorite = useRemoveFavoriteMutation();
  const addToCart = useAddCartItemMutation();

  const listing = listingQuery.data;
  const isFavorite = !!favoritesQuery.data?.some((f) => f.listing.id === listingId);
  const priceStr = listing ? String(listing.price) : undefined;
  const originalPriceStr =
    listing?.originalPrice != null ? String(listing.originalPrice) : undefined;
  const discount = priceStr ? discountPercent(priceStr, originalPriceStr) : null;

  const onToggleFavorite = () => {
    if (!listing) return;
    if (!isAuthenticated) {
      Alert.alert('Entre para favoritar', 'Crie uma conta ou faça login para favoritar livros.');
      return;
    }
    if (isFavorite) {
      removeFavorite.mutate(listing.id, {
        onSuccess: () => toast.success('Removido dos favoritos.'),
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else {
      addFavorite.mutate(listing.id, {
        onSuccess: () => toast.success('Adicionado aos favoritos.'),
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const onAddToCart = () => {
    if (!listing) return;
    if (!isAuthenticated) {
      Alert.alert('Entre para comprar', 'Crie uma conta ou faça login para usar o carrinho.');
      return;
    }
    addToCart.mutate(
      { listingId: listing.id, quantity: 1 },
      {
        onSuccess: () => toast.success('Adicionado ao carrinho.'),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  if (listingQuery.isLoading) {
    return (
      <AppScreen>
        <LoadingState message="Carregando detalhes…" />
      </AppScreen>
    );
  }

  if (listingQuery.isError || !listing) {
    return (
      <AppScreen>
        <View style={styles.topBar}>
          <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        </View>
        <ErrorState
          title="Anúncio indisponível"
          description={getErrorMessage(listingQuery.error)}
          onRetry={() => listingQuery.refetch()}
        />
      </AppScreen>
    );
  }

  const outOfStock = listing.stockQuantity === 0;

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          color={isFavorite ? colors.error : colors.primary}
          onPress={onToggleFavorite}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.coverWrap}>
          {listing.coverImageUrl ? (
            <Image
              source={{ uri: listing.coverImageUrl }}
              style={styles.cover}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cover, styles.coverFallback]}>
              <Ionicons name="book-outline" size={56} color={colors.textSecondary} />
            </View>
          )}
          {discount ? (
            <Badge label={`-${discount}%`} tone="accent" style={styles.discountBadge} />
          ) : null}
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>{listing.book.categoryName}</Text>
          <Text style={styles.title}>{listing.book.title}</Text>
          <Text style={styles.author}>por {listing.book.author}</Text>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatBRL(listing.price)}</Text>
          {originalPriceStr ? (
            <Text style={styles.originalPrice}>{formatBRL(originalPriceStr)}</Text>
          ) : null}
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Condição</Text>
            <Text style={styles.metaValue}>{formatCondition(listing.condition)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Estoque</Text>
            <Text style={styles.metaValue}>
              {outOfStock ? 'Esgotado' : `${listing.stockQuantity} disponíveis`}
            </Text>
          </View>
          {listing.city || listing.state ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Local</Text>
              <Text style={styles.metaValue}>
                {[listing.city, listing.state].filter(Boolean).join(' · ')}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendedor</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="storefront-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.sellerBody}>
              <Text style={styles.sellerName}>{listing.seller.storeName}</Text>
              <Text style={styles.sellerType}>{SELLER_TYPE_LABEL[listing.seller.type]}</Text>
              <View style={styles.sellerRating}>
                <Ionicons name="star" size={14} color={colors.accent} />
                <Text style={styles.sellerRatingText}>
                  {formatRating(listing.seller.rating)} de avaliação
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        <View style={styles.section}>
          <Pressable disabled style={styles.chatRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.chatText}>Conversar com vendedor — em breve</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={outOfStock ? 'Esgotado' : 'Adicionar ao carrinho'}
          fullWidth
          disabled={outOfStock}
          loading={addToCart.isPending}
          onPress={onAddToCart}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  coverWrap: {
    alignSelf: 'center',
    width: 200,
    aspectRatio: 0.7,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  header: {
    gap: 2,
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.secondary,
  },
  title: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 26,
    lineHeight: 30,
    color: colors.primary,
    textAlign: 'center',
  },
  author: {
    ...typography.body,
    color: colors.textSecondary,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  price: {
    fontFamily: fontFamily.inter900,
    fontSize: 28,
    color: colors.primary,
  },
  originalPrice: {
    ...typography.body,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  metaItem: {
    flexGrow: 1,
    minWidth: 100,
    gap: 2,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerBody: {
    flex: 1,
    gap: 2,
  },
  sellerName: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  sellerType: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sellerRatingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  chatText: {
    ...typography.caption,
    color: colors.textSecondary,
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
