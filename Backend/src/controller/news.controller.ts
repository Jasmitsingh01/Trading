// newsController.ts
import axios from 'axios';
import type { FastifyRequest, FastifyReply } from 'fastify';
import RequestHandler from '../utility/requestHandler.ts';
import dotenv from 'dotenv';
dotenv.config();
interface NewsArticle {
  source: { id?: string; name: string };
  author?: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}

interface NewsQuery {
  q?: string; // search query (e.g., "bitcoin", "forex", "tesla")
  sources?: string; // comma-separated source IDs
  domains?: string; // comma-separated domains
  category?: 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
  language?: string; // e.g., 'en', 'hi'
  country?: string; // e.g., 'us', 'in'
  pageSize?: string; // max 100
  page?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}

interface PaginationQuery {
  page?: string;
  limit?: string;
  q?: string; // search query parameter
}

const NEWS_API_KEY = process.env.NEWSAPI_KEY; // Add to .env: NEWSAPI_KEY=your_key_here
const NEWS_API_BASE = 'https://newsapi.org/v2';

if (!NEWS_API_KEY) {
  console.warn('⚠️  NEWSAPI_KEY environment variable is not set. News API will not work until you add it to .env file.');
}

const fetchNews = async (params: NewsQuery): Promise<NewsArticle[]> => {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('NEWSAPI_KEY is not configured. Please add it to your .env file.');
    }

    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        ...params,
      },
    });
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error(`News API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchAllNews = async (params: NewsQuery = { category: 'business', language: 'en', pageSize: '50' }): Promise<NewsArticle[]> => {
  // Default to business/finance news relevant to your trading platform
  const defaultParams: NewsQuery = {
    q: 'finance OR stocks OR crypto OR forex OR market',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '50',
    ...params,
  };
  return await fetchNews(defaultParams);
};

// Paginated handler for news
export const AllNewsWithPagination = RequestHandler(async (req: FastifyRequest<{ Querystring: PaginationQuery }>, res: FastifyReply) => {
  try {
    // Fetch all news (your existing pattern)
    const data = await fetchAllNews({ 
      q: req.query.q || 'finance OR stocks OR crypto OR forex',
      category: 'business',
      language: 'en',
      pageSize: '100' // Max for pagination
    });

    // Parse and validate query parameters (exact match to your files)
    let page = parseInt(req.query.page || '1', 10);
    let limit = parseInt(req.query.limit || '10', 10);

    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 10;
    if (limit < 1 || limit > 100) limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching news data:', error);
    throw error;
  }
});

// Specific endpoints for your trading categories
export const fetchCryptoNews = RequestHandler(async (req: FastifyRequest<{ Querystring: NewsQuery }>, res: FastifyReply) => {
  const data = await fetchAllNews({ 
    q: 'bitcoin OR ethereum OR crypto OR cryptocurrency',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20'
  });
  return { data };
});

export const fetchForexNews = RequestHandler(async (req: FastifyRequest<{ Querystring: NewsQuery }>, res: FastifyReply) => {
  const data = await fetchAllNews({ 
    q: 'forex OR currency OR usd OR eur OR gbp',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20'
  });
  return { data };
});

export const fetchStockNews = RequestHandler(async (req: FastifyRequest<{ Querystring: NewsQuery }>, res: FastifyReply) => {
  const data = await fetchAllNews({ 
    q: 'stocks OR nifty OR sensex OR nasdaq OR sp500',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20'
  });
  return { data };
});

export default {
  fetchAllNews,
  AllNewsWithPagination,
  fetchCryptoNews,
  fetchForexNews,
  fetchStockNews
};
