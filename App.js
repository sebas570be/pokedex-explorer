// App.js
// Root of the app. SafeAreaProvider must wrap everything so that any
// SafeAreaView inside can know the safe margins of the device.
//
// Two views, no navigation library (the blank template has none):
// - selectedPokemonId === null -> only the list is visible
// - selectedPokemonId has an id -> the detail is drawn ON TOP of the list
// The list is never unmounted, so going back keeps the loaded Pokémon and
// the scroll position, and does not repeat the request.
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PokemonListScreen from './screens/PokemonListScreen';
import PokemonDetailScreen from './screens/PokemonDetailScreen';

export default function App() {
  // CONCEPT (class): useState decides which view is shown.
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const isDetailOpen = selectedPokemonId !== null;

  const openDetail = useCallback((pokemon) => setSelectedPokemonId(pokemon.id), []);
  const closeDetail = useCallback(() => setSelectedPokemonId(null), []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View
        style={styles.flex}
        // While the detail is open, screen readers must not read the list behind it.
        accessibilityElementsHidden={isDetailOpen}
        importantForAccessibility={isDetailOpen ? 'no-hide-descendants' : 'auto'}
      >
        <PokemonListScreen onSelectPokemon={openDetail} />
      </View>

      {isDetailOpen && (
        <View style={StyleSheet.absoluteFill}>
          <PokemonDetailScreen pokemonId={selectedPokemonId} onBack={closeDetail} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
