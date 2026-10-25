// hooks/usePokemonList.js
// Custom hook (name starts with "use") that owns ALL the state of the list
// view: first load, infinite scroll pagination, search and errors.
// The screen only reads these values and draws them; it never calls fetch.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPokemonDetail, getPokemonList } from '../api/pokeApi';
import { normalizeSearch } from '../utils/format';

const PAGE_SIZE = 20;

export default function usePokemonList() {
  // CONCEPT (class): useState -> each piece of UI state has its own variable.
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'success'
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  // Search state: 'idle' means "no search, show the normal list".
  const [searchStatus, setSearchStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'notFound' | 'error'
  const [searchResult, setSearchResult] = useState(null);

  // CONCEPT: useRef keeps a value between renders WITHOUT re-rendering.
  // onEndReached can fire several times in a row; this flag blocks a second
  // request while one is already running (avoids duplicated pages).
  const isFetchingRef = useRef(false);
  // Id of the latest search: if the user searches twice quickly, the
  // answer of the old search is ignored when it arrives late.
  const searchIdRef = useRef(0);

  const loadPage = useCallback(async (pageOffset) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const isFirstPage = pageOffset === 0;
    if (isFirstPage) {
      setStatus('loading');
    } else {
      setLoadingMore(true);
    }
    setLoadMoreError(false);

    // CONCEPT (class): try/catch/finally with async/await to handle
    // success, error and "always stop loading".
    try {
      const page = await getPokemonList(PAGE_SIZE, pageOffset);
      // Functional update: append the new page to the previous one
      // instead of replacing it (that is what makes infinite scroll work).
      setPokemons((previous) => (isFirstPage ? page.items : [...previous, ...page.items]));
      setOffset(pageOffset + PAGE_SIZE);
      setHasMore(page.hasMore);
      setStatus('success');
    } catch (error) {
      if (isFirstPage) {
        setStatus('error');
      } else {
        setLoadMoreError(true);
      }
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  // CONCEPT (class): useEffect + dependency array.
  // loadPage is created once (useCallback with []), so this effect runs
  // ONLY when the screen mounts: the first 20 Pokémon. If we put a value
  // here that changes on every render, the request would repeat forever.
  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  // Called by FlatList's onEndReached.
  const loadMore = useCallback(() => {
    // No more pages, a search is active, the first load is not ready, or
    // the last attempt failed (the user must press "Reintentar" instead
    // of retrying in a loop every time the list touches the end).
    if (!hasMore || searchStatus !== 'idle' || status !== 'success' || loadMoreError) return;
    loadPage(offset);
  }, [hasMore, searchStatus, status, loadMoreError, offset, loadPage]);

  const retry = useCallback(() => loadPage(0), [loadPage]);
  const retryMore = useCallback(() => loadPage(offset), [loadPage, offset]);

  const clearSearch = useCallback(() => {
    searchIdRef.current += 1; // any pending search becomes "old"
    setSearchStatus('idle');
    setSearchResult(null);
  }, []);

  const search = useCallback(
    async (text) => {
      const query = normalizeSearch(text);
      if (!query) {
        clearSearch();
        return;
      }

      const searchId = ++searchIdRef.current;
      setSearchStatus('loading');
      setSearchResult(null);

      try {
        const pokemon = await getPokemonDetail(query);
        if (searchId !== searchIdRef.current) return; // an older search answered late
        setSearchResult({ id: pokemon.id, name: pokemon.name, image: pokemon.image });
        setSearchStatus('success');
      } catch (error) {
        if (searchId !== searchIdRef.current) return;
        // 404 from the API = that name/number does not exist (not a network failure).
        setSearchStatus(error.status === 404 ? 'notFound' : 'error');
      }
    },
    [clearSearch]
  );

  return {
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
  };
}
