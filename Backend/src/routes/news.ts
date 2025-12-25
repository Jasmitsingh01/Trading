// newsController.ts
import axios from 'axios';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
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
  q?: string;
  sources?: string;
  domains?: string;
  language?: string;
  country?: string;
  pageSize?: string;
  page?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  from?: string; // date filter
  to?: string;
}

interface PaginationQuery {
  page?: string;
  limit?: string;
  q?: string;
}

const NEWS_API_KEY = process.env.NEWSAPI_KEY;
const NEWS_API_BASE = 'https://newsapi.org/v2';

if (!NEWS_API_KEY) {
  console.warn('⚠️ NEWSAPI_KEY environment variable is not set.');
}

const fetchNews = async (params: NewsQuery): Promise<NewsArticle[]> => {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('NEWSAPI_KEY is not configured');
    }

    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        ...params,
        // Remove unsupported params for /everything endpoint
        category: undefined,
      },
    });

    return response.data.articles || [];
  } catch (error: any) {
    console.error('Error fetching news:', error.response?.data || error.message);
    
    // Handle specific API errors
    if (error.response?.status === 400) {
      throw new Error(`NewsAPI parameter error: ${error.response.data.message}`);
    }
    throw new Error(`News API error: ${error.response?.data?.message || error.message}`);
  }
};

export const fetchAllNews = async (params: NewsQuery = {}): Promise<NewsArticle[]> => {
  const defaultParams: NewsQuery = {
    q: 'finance OR stocks OR crypto OR forex OR market',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '50',
    ...params,
  };
  return await fetchNews(defaultParams);
};

export const AllNewsWithPagination = RequestHandler(async (req: FastifyRequest<{ Querystring: PaginationQuery }>, res: FastifyReply) => {
  try {
    const data = await fetchAllNews({ 
      q: req.query.q || 'finance OR stocks OR crypto OR forex',
      language: 'en',
      pageSize: '100'
      // ✅ Removed category parameter
    });

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

// ✅ Fixed specific handlers - no category param
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

export const registerNewsRoutes = (fastify: FastifyInstance) => {
  // Get all news with pagination
  fastify.get('/api/news', AllNewsWithPagination);
  
  // Get crypto news
  fastify.get('/api/news/crypto', fetchCryptoNews);
  
  // Get forex news
  fastify.get('/api/news/forex', fetchForexNews);
  
  // Get stock news
  fastify.get('/api/news/stocks', fetchStockNews);
};

export default {
  fetchAllNews,
  AllNewsWithPagination,
  fetchCryptoNews,
  fetchForexNews,
  fetchStockNews,
  registerNewsRoutes
};
