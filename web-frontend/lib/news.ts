/**
 * News API Client for Frontend
 * Fetches financial news from backend API
 */

const API_BASE = 'http://localhost:8080/api';

export interface NewsArticle {
    source: { id?: string; name: string };
    author?: string;
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content?: string;
}

export interface NewsPaginationResponse {
    data: NewsArticle[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Fetch all news articles
 */
export async function fetchAllNews(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(`${API_BASE}/news`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        throw error;
    }
}

/**
 * Fetch news with pagination
 */
export async function fetchNewsPaginated(
    page: number = 1,
    limit: number = 10,
    query?: string
): Promise<NewsPaginationResponse> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (query) {
            params.append('q', query);
        }

        const response = await fetch(`${API_BASE}/news?${params}`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Error fetching paginated news:', error);
        throw error;
    }
}

/**
 * Fetch cryptocurrency news
 */
export async function fetchCryptoNews(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(`${API_BASE}/news/crypto`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('❌ Error fetching crypto news:', error);
        throw error;
    }
}

/**
 * Fetch forex news
 */
export async function fetchForexNews(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(`${API_BASE}/news/forex`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('❌ Error fetching forex news:', error);
        throw error;
    }
}

/**
 * Fetch stock market news
 */
export async function fetchStockNews(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(`${API_BASE}/news/stocks`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('❌ Error fetching stock news:', error);
        throw error;
    }
}

/**
 * Search news by query
 */
export function searchNews(articles: NewsArticle[], query: string): NewsArticle[] {
    const searchTerm = query.toLowerCase();
    return articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.description?.toLowerCase().includes(searchTerm) ||
        article.content?.toLowerCase().includes(searchTerm)
    );
}

/**
 * Sort news articles
 */
export function sortNews(
    articles: NewsArticle[],
    sortBy: 'date' | 'title' = 'date',
    order: 'asc' | 'desc' = 'desc'
): NewsArticle[] {
    return [...articles].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'date':
                comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
        }

        return order === 'asc' ? comparison : -comparison;
    });
}

/**
 * Format date for display
 */
export function formatNewsDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

/**
 * Get news by category
 */
export async function getNewsByCategory(category: 'crypto' | 'forex' | 'stocks'): Promise<NewsArticle[]> {
    switch (category) {
        case 'crypto':
            return await fetchCryptoNews();
        case 'forex':
            return await fetchForexNews();
        case 'stocks':
            return await fetchStockNews();
        default:
            return await fetchAllNews();
    }
}

export default {
    fetchAllNews,
    fetchNewsPaginated,
    fetchCryptoNews,
    fetchForexNews,
    fetchStockNews,
    searchNews,
    sortNews,
    formatNewsDate,
    getNewsByCategory
};
