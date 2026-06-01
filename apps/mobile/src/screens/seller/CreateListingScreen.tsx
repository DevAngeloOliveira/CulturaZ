import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { SearchInput } from '@/components/forms/SearchInput';
import { SelectChip } from '@/components/forms/SelectChip';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useCategoriesQuery, useCreateSellerListingMutation } from '@/hooks/api';
import { useDebounce } from '@/hooks/useDebounce';
import { booksApi } from '@/services/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { BookResponse, ListingCondition } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatCondition } from '@/utils/format';

const CONDITIONS: ListingCondition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'DAMAGED'];

const parseMoney = (value: string): number | undefined => {
  const trimmed = value.replace(',', '.').trim();
  if (!trimmed) return undefined;
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export const CreateListingScreen = () => {
  const navigation = useNavigation();
  const categoriesQuery = useCategoriesQuery();
  const createListing = useCreateSellerListingMutation();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState<BookResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const [book, setBook] = useState<BookResponse | null>(null);

  const [showCreateBook, setShowCreateBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategoryId, setNewBookCategoryId] = useState<string | undefined>();
  const [creatingBook, setCreatingBook] = useState(false);

  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [condition, setCondition] = useState<ListingCondition>('GOOD');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) return;
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    booksApi
      .search({ q: debouncedQuery.trim(), size: 8 })
      .then((page) => {
        if (!cancelled) setResults(page.items);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, book]);

  const onCreateBook = async () => {
    setError(null);
    if (newBookTitle.trim().length < 2 || newBookAuthor.trim().length < 2 || !newBookCategoryId) {
      setError('Preencha título, autor e categoria.');
      return;
    }
    try {
      setCreatingBook(true);
      const created = await booksApi.create({
        title: newBookTitle.trim(),
        author: newBookAuthor.trim(),
        categoryId: newBookCategoryId,
      });
      setBook(created);
      setShowCreateBook(false);
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookCategoryId(undefined);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreatingBook(false);
    }
  };

  const canSubmit = book && parseMoney(price) !== undefined && Number(stock) > 0 && description.trim().length > 0;

  const onSubmit = async () => {
    if (!book) return;
    setError(null);
    const priceValue = parseMoney(price);
    if (priceValue === undefined) {
      setError('Informe um preço válido.');
      return;
    }
    const stockValue = Number(stock);
    if (!Number.isInteger(stockValue) || stockValue <= 0) {
      setError('Estoque deve ser um número inteiro maior que zero.');
      return;
    }
    try {
      await createListing.mutateAsync({
        bookId: book.id,
        price: priceValue,
        originalPrice: parseMoney(originalPrice),
        stockQuantity: stockValue,
        condition,
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim() || undefined,
        city: city.trim() || undefined,
        state: stateUf.trim() ? stateUf.trim().toUpperCase().slice(0, 2) : undefined,
      });
      Alert.alert('Anúncio publicado', 'Aguarde a curadoria liberar.', [
        { text: 'Ok', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Novo anúncio</Text>
        <View style={styles.spacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Livro</Text>
            {book ? (
              <View style={[styles.bookCard, shadows.sm]}>
                <View style={styles.bookBody}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookMeta}>
                    {book.author} · {book.categoryName}
                  </Text>
                </View>
                <Pressable onPress={() => setBook(null)} hitSlop={6}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </Pressable>
              </View>
            ) : (
              <>
                <SearchInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Busque por título, autor ou ISBN"
                  containerStyle={styles.search}
                  autoCorrect={false}
                />
                {searching ? <Text style={styles.hint}>Buscando…</Text> : null}
                {results.length > 0 ? (
                  <View style={styles.results}>
                    {results.map((b) => (
                      <Pressable
                        key={b.id}
                        onPress={() => {
                          setBook(b);
                          setQuery('');
                          setResults([]);
                        }}
                        style={({ pressed }) => [
                          styles.resultRow,
                          pressed ? { backgroundColor: colors.primaryMuted } : null,
                        ]}
                      >
                        <View>
                          <Text style={styles.resultTitle}>{b.title}</Text>
                          <Text style={styles.resultMeta}>
                            {b.author} · {b.categoryName}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                {!showCreateBook ? (
                  <Pressable onPress={() => setShowCreateBook(true)} hitSlop={6} style={styles.linkRow}>
                    <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                    <Text style={styles.link}>Cadastrar novo livro</Text>
                  </Pressable>
                ) : (
                  <View style={styles.newBookForm}>
                    <TextField
                      label="Título"
                      value={newBookTitle}
                      onChangeText={setNewBookTitle}
                      autoCapitalize="words"
                    />
                    <TextField
                      label="Autor"
                      value={newBookAuthor}
                      onChangeText={setNewBookAuthor}
                      autoCapitalize="words"
                    />
                    <Text style={styles.fieldLabel}>Categoria</Text>
                    <View style={styles.chips}>
                      {(categoriesQuery.data ?? [])
                        .filter((c) => c.active)
                        .map((c) => (
                          <SelectChip
                            key={c.id}
                            label={c.name}
                            selected={newBookCategoryId === c.id}
                            onPress={() => setNewBookCategoryId(c.id)}
                          />
                        ))}
                    </View>
                    <View style={styles.row}>
                      <Button
                        label="Cancelar"
                        variant="outline"
                        onPress={() => setShowCreateBook(false)}
                        style={styles.flex1}
                      />
                      <Button
                        label="Criar"
                        loading={creatingBook}
                        onPress={onCreateBook}
                        style={styles.flex1}
                      />
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          {book ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Anúncio</Text>
              <View style={styles.row}>
                <TextField
                  label="Preço"
                  placeholder="R$ 0,00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  containerStyle={styles.flex1}
                />
                <TextField
                  label="Preço original"
                  placeholder="(opcional)"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="decimal-pad"
                  containerStyle={styles.flex1}
                />
              </View>
              <View style={styles.row}>
                <TextField
                  label="Estoque"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                  containerStyle={styles.flex1}
                />
                <View style={styles.flex2} />
              </View>

              <Text style={styles.fieldLabel}>Condição</Text>
              <View style={styles.chips}>
                {CONDITIONS.map((c) => (
                  <SelectChip
                    key={c}
                    label={formatCondition(c)}
                    selected={condition === c}
                    onPress={() => setCondition(c)}
                  />
                ))}
              </View>

              <TextField
                label="Descrição"
                placeholder="Detalhes da obra, conservação, edição…"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
              <TextField
                label="URL da capa (opcional)"
                placeholder="https://…"
                value={coverImageUrl}
                onChangeText={setCoverImageUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <View style={styles.row}>
                <TextField
                  label="Cidade"
                  value={city}
                  onChangeText={setCity}
                  containerStyle={styles.flex2}
                />
                <TextField
                  label="UF"
                  value={stateUf}
                  onChangeText={(v) => setStateUf(v.toUpperCase().slice(0, 2))}
                  autoCapitalize="characters"
                  maxLength={2}
                  containerStyle={styles.flex1}
                />
              </View>
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Button
          label="Publicar"
          fullWidth
          loading={createListing.isPending}
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  spacer: { width: 44 },
  scroll: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  bookBody: {
    flex: 1,
    gap: 2,
  },
  bookTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  bookMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  search: {
    backgroundColor: colors.surface,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  results: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  resultRow: {
    padding: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  resultMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  link: {
    ...typography.label,
    color: colors.primary,
  },
  newBookForm: {
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.primary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  errorText: {
    ...typography.caption,
    color: colors.error,
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
