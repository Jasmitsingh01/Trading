/**
 * React Hook for News Data
 * Easy-to-use hook for fetching financial news
 */

import { useEffect, useState, useCallback } from 'react';
import { 
    fetchAllNews, 
    fetchNewsPaginated, 
    fetchCryptoNews, 
    fetchForexNews, 
    fetchStockNews,
    type NewsArticle,
    type NewsPaginationResponse
} from '@/lib/news';

interface UseNewsOptions {
    category?: 'all' | 'crypto' | 'forex' | 'stocks';
    autoFetch?: boolean;
    refreshInterval?: number; // in milliseconds
}

interface UseNewsReturn {
    news: NewsArticle[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch news articles
 * 
 * @example
 * const { news, isLoading, error } = useNews({ category: 'crypto' });
 */
export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
    const { category = 'all', autoFetch = true, refreshInterval } = options;

    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let data: NewsArticle[];

            switch (category) {
                case 'crypto':
                    data = await fetchCryptoNews();
                    break;
                case 'forex':
                    data = await fetchForexNews();
                    break;
                case 'stocks':
                    data = await fetchStockNews();
                    break;
                default:
                    data = await fetchAllNews();
            }

            setNews(data);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [category]);

    // Auto-fetch on mount and when category changes
    useEffect(() => {
        if (autoFetch) {
            fetchNews();
        }
    }, [autoFetch, fetchNews]);

    // Set up refresh interval if specified
    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(() => {
                fetchNews();
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [refreshInterval, fetchNews]);

    return {
        news,
        isLoading,
        error,
        refetch: fetchNews
    };
}

/**
 * Hook to fetch paginated news
 */
export function useNewsPaginated(initialPage: number = 1, initialLimit: number = 10) {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [pagination, setPagination] = useState({
        page: initialPage,
        limit: initialLimit,
        total: 0,
        totalPages: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPage = useCallback(async (page: number, limit: number, query?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response: NewsPaginationResponse = await fetchNewsPaginated(page, limit, query);
            setNews(response.data);
            setPagination(response.pagination);
        } catch (err) {
            console.error('Error fetching paginated news:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch initial page
    useEffect(() => {
        fetchPage(initialPage, initialLimit);
    }, [initialPage, initialLimit, fetchPage]);

    const goToPage = useCallback((page: number) => {
        fetchPage(page, pagination.limit);
    }, [fetchPage, pagination.limit]);

    const changeLimit = useCallback((limit: number) => {
        fetchPage(1, limit); // Reset to page 1 when changing limit
    }, [fetchPage]);

    const search = useCallback((query: string) => {
        fetchPage(1, pagination.limit, query);
    }, [fetchPage, pagination.limit]);

    return {
        news,
        pagination,
        isLoading,
        error,
        goToPage,
        changeLimit,
        search,
        refetch: () => fetchPage(pagination.page, pagination.limit)
    };
}

/**
 * Hook to get latest news for a specific category
 */
export function useCategoryNews(category: 'crypto' | 'forex' | 'stocks') {
    return useNews({ category, autoFetch: true });
}

/**
 * Hook with auto-refresh for live news updates
 */
export function useLiveNews(category: 'all' | 'crypto' | 'forex' | 'stocks' = 'all', refreshMinutes: number = 5) {
    return useNews({ 
        category, 
        autoFetch: true, 
        refreshInterval: refreshMinutes * 60 * 1000 
    });
}

export default useNews;
