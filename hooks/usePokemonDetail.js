// hooks/usePokemonDetail.js
// Custom hook that loads ONE Pokémon's detail and exposes its UI state:
// 'loading' | 'error' | 'notFound' | 'success'.
import { useCallback, useEffect, useState } from 'react';
import { getPokemonDetail } from '../api/pokeApi';

export default function usePokemonDetail(pokemonId) {
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState('loading');
  // Changing this number forces the effect to run again ("Reintentar").
  const [reloadKey, setReloadKey] = useState(0);

  // CONCEPT (class): useEffect with dependencies [pokemonId, reloadKey].
  // The request runs when the screen opens, when another Pokémon is
  // selected, or when the user presses "Reintentar" — never on every render.
  useEffect(() => {
    if (pokemonId == null) return undefined;

    // If the user goes back (or picks another Pokémon) before the answer
    // arrives, "active" becomes false and the old answer is ignored, so we
    // never update the state of a screen that is no longer shown.
    let active = true;

    const load = async () => {
      setStatus('loading');
      setPokemon(null);
      try {
        const data = await getPokemonDetail(pokemonId);
        if (!active) return;
        setPokemon(data);
        setStatus('success');
      } catch (error) {
        if (!active) return;
        setStatus(error.status === 404 ? 'notFound' : 'error');
      }
    };

    load();

    // CONCEPT (class): cleanup function of useEffect.
    return () => {
      active = false;
    };
  }, [pokemonId, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return { pokemon, status, retry };
}
