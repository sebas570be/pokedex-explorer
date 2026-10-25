// App.js
// Root of the app. SafeAreaProvider must wrap everything so that any
// SafeAreaView inside can know the safe margins of the device.
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PokemonListScreen from './screens/PokemonListScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* Next step: tapping a card will open the detail view */}
      <PokemonListScreen />
    </SafeAreaProvider>
  );
}
