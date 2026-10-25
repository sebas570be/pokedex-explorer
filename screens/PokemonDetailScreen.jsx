// screens/PokemonDetailScreen.jsx
// Detail view: big image, name and number, type badges, height/weight,
// the 6 base stats with bars and the "Volver a la lista" button.
// It only draws: the request and its state come from usePokemonDetail().
import React, { useEffect } from 'react';
import { BackHandler, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePokemonDetail from '../hooks/usePokemonDetail';
import StatusView from '../components/StatusView';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import { STAT_LABELS } from '../constants/statLabels';
import { getTypeColor } from '../constants/typeColors';
import { colors } from '../constants/colors';
import { capitalize, formatId } from '../utils/format';

function formatNumber(value) {
  // 0.4 -> "0,4" (decimal comma, as used in Colombia)
  return value.toLocaleString('es-CO', { maximumFractionDigits: 1 });
}

export default function PokemonDetailScreen({ pokemonId, onBack }) {
  const { pokemon, status, retry } = usePokemonDetail(pokemonId);

  // Android hardware "back" button returns to the list instead of
  // closing the app (there is no navigation library handling it for us).
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true; // "we handled it"
    });
    return () => subscription.remove();
  }, [onBack]);

  const renderContent = () => {
    if (status === 'loading') {
      return <StatusView type="loading" message="Cargando ficha del Pokémon..." />;
    }
    if (status === 'notFound') {
      return <StatusView type="empty" message="Este Pokémon no existe en la PokéDex." />;
    }
    if (status === 'error' || !pokemon) {
      return (
        <StatusView
          type="error"
          message="No pudimos cargar la ficha. Revisa tu conexión a internet."
          onAction={retry}
        />
      );
    }

    const mainColor = getTypeColor(pokemon.types[0]);

    return (
      // The detail is short and fixed (6 stats), so ScrollView is fine here.
      // FlatList is for long or unknown-size lists like the main grid.
      <ScrollView contentContainerStyle={styles.content}>
        {/* "26" at the end of the hex = ~15 % opacity of the type color */}
        <View style={[styles.hero, { backgroundColor: `${mainColor}26` }]}>
          <Image
            source={{ uri: pokemon.image }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={`Imagen de ${capitalize(pokemon.name)}`}
          />
        </View>

        <Text style={styles.number}>{formatId(pokemon.id)}</Text>
        <Text style={styles.name} accessibilityRole="header">
          {capitalize(pokemon.name)}
        </Text>

        <View style={styles.types}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>

        <View style={styles.measures}>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{formatNumber(pokemon.heightMeters)} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measureBox}>
            <Text style={styles.measureValue}>{formatNumber(pokemon.weightKilograms)} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas base</Text>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} label={STAT_LABELS[stat.name] ?? stat.name} value={stat.value} />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      {/* Always visible, in every state (loading, error, success) */}
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        onPress={onBack}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Text style={styles.backText}>← Volver a la lista</Text>
      </Pressable>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 16,
  },
  image: {
    width: 220,
    height: 220,
  },
  number: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  name: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  measures: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  measureBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  measureValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  measureLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
});
