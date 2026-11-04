import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import CS571 from '@cs571/mobile-client';

const ARTICLES_URL = 'https://cs571api.cs.wisc.edu/v2/rest/f26/hw8/articles';
const BadgerNewsContext = createContext(null);

export function BadgerNewsProvider({ children }) {
    const [articles, setArticles] = useState([]);
    const [preferences, setPreferences] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        async function loadArticles() {
            const badgerId = CS571.getBadgerId();
            if (!badgerId) {
                throw new Error('The Badger ID is not configured. Check EXPO_PUBLIC_CS571_BADGER_ID and restart Expo.');
            }

            const response = await fetch(ARTICLES_URL, {
                headers: { 'X-CS571-ID': badgerId },
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Could not load news (HTTP ${response.status}).`);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('The news service returned an unexpected response.');
            }

            setArticles(data);
        }

        loadArticles()
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') {
                    setError(requestError.message || 'An unexpected error occurred while loading news.');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [reloadKey]);

    const setPreference = useCallback((tag, enabled) => {
        setPreferences((currentPreferences) => ({
            ...currentPreferences,
            [tag]: enabled
        }));
    }, []);

    const retry = useCallback(() => setReloadKey((key) => key + 1), []);
    const value = useMemo(() => ({
        articles,
        preferences,
        setPreference,
        isLoading,
        error,
        retry
    }), [articles, preferences, setPreference, isLoading, error, retry]);

    return (
        <BadgerNewsContext.Provider value={value}>
            {children}
        </BadgerNewsContext.Provider>
    );
}

export function useBadgerNews() {
    const context = useContext(BadgerNewsContext);
    if (!context) {
        throw new Error('useBadgerNews must be used within a BadgerNewsProvider.');
    }
    return context;
}
