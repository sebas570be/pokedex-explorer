// screens/PokemonListScreen.jsx
// List view: header, search bar and a 2-column grid with infinite scroll.
// It only draws: all the data and the requests come from usePokemonList().
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePokemonList from '../hooks/usePokemonList';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import StatusView from '../components/StatusView';
import { colors } from '../constants/colors';

export default function PokemonListScreen({ onSelectPokemon }) {
  const {
    pokemons,
    status,
    hasMore,
    loadingMore,
    loadMoreError,
    loadMore,
    retry,
    retryMore,
    searchStatus,
    searchResult,
    search,
    clearSearch,
  } = usePokemonList();

  const [query, setQuery] = useState('');

  const handleSearch = () => search(query);

  const handleClearSearch = () => {
    setQuery('');
    clearSearch();
  };

  const renderCard = ({ item }) => (
    // flex: 1 + maxWidth 50% -> two equal columns; a lonely card (odd
    // count or a single search result) keeps half width instead of stretching.
    <View style={styles.cell}>
      <PokemonCard pokemon={item} onPress={onSelectPokemon} />
    </View>
  );

  // Footer of the list: what happens at the end while scrolling.
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.footerText}>Cargando más Pokémon...</Text>
        </View>
      );
    }
    if (loadMoreError) {
      return (
        <View style={styles.footer}>
          <Text style={styles.errorText}>No se pudieron cargar más Pokémon.</Text>
          <Pressable onPress={retryMore} accessibilityRole="button">
            <Text style={styles.link}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }
    if (!hasMore) {
      return <Text style={[styles.footerText, styles.footer]}>Has llegado al final de la PokéDex.</Text>;
    }
    return null;
  };

  const renderGrid = (data, withPagination) => (
    // CONCEPT (class): FlatList instead of ScrollView + map -> it only
    // renders what is visible, so it can handle 1000+ Pokémon.
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)} // keys must be unique strings
      renderItem={renderCard}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      onEndReached={withPagination ? loadMore : undefined}
      onEndReachedThreshold={0.5} // ask for more when half a screen is left
      ListFooterComponent={withPagination ? renderFooter : null}
      keyboardShouldPersistTaps="handled"
    />
  );

  const renderContent = () => {
    // 1) A search is active: show its own state.
    if (searchStatus === 'loading') {
      return <StatusView type="loading" message="Buscando Pokémon..." />;
    }
    if (searchStatus === 'notFound') {
      return (
        <StatusView
          type="empty"
          message={`No encontramos ningún Pokémon con "${query.trim()}".`}
          actionLabel="Ver todos"
          onAction={handleClearSearch}
        />
      );
    }
    if (searchStatus === 'error') {
      return (
        <StatusView
          type="error"
          message="No pudimos hacer la búsqueda. Revisa tu conexión a internet."
          onAction={handleSearch}
        />
      );
    }
    if (searchStatus === 'success' && searchResult) {
      return (
        <View style={styles.flex}>
          <Pressable onPress={handleClearSearch} accessibilityRole="button" style={styles.backToAll}>
            <Text style={styles.link}>← Ver todos los Pokémon</Text>
          </Pressable>
          {renderGrid([searchResult], false)}
        </View>
      );
    }

    // 2) Normal list.
    if (status === 'loading') {
      return <StatusView type="loading" message="Cargando Pokémon..." />;
    }
    if (status === 'error') {
      return (
        <StatusView
          type="error"
          message="No pudimos cargar los Pokémon. Revisa tu conexión a internet."
          onAction={retry}
        />
      );
    }
    return renderGrid(pokemons, true);
  };

  return (
    // CONCEPT (class): SafeAreaView keeps the content away from the notch/status bar.
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <Text style={styles.title} accessibilityRole="header">
        PokéDex Explorer
      </Text>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  cell: {
    flex: 1,
    maxWidth: '50%',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    textAlign: 'center',
    color: colors.textMuted,
  },
  errorText: {
    color: colors.error,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  backToAll: {
    marginBottom: 12,
  },
});
