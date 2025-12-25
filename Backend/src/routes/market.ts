// backend/src/routes/market.ts (create if doesn't exist)
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware.ts';
import Watchlist from '../models/watchlist.model.ts';

export async function registerMarketRoutes(app: FastifyInstance) {
    // Get live quotes for user's watchlist
    app.get('/api/market/watchlist-quotes', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request as any).user.userId;

            // Get user's watchlist
            const watchlist = await Watchlist.findOne({ userId });

            if (!watchlist || !watchlist.assets || watchlist.assets.length === 0) {
                return reply.send({
                    success: true,
                    data: []
                });
            }

            // Fetch live prices for each asset
            const quotes = await Promise.all(
                watchlist.assets.map(async (asset: any) => {
                    try {
                        // For crypto, use Binance API
                        if (asset.assetType === 'cryptocurrency') {
                            const binanceResponse = await fetch(
                                `https://api.binance.com/api/v3/ticker/24hr?symbol=${asset.symbol}USDT`
                            );
                            const data = await binanceResponse.json();

                            return {
                                symbol: asset.symbol,
                                name: asset.symbol,
                                price: parseFloat(data.lastPrice),
                                changePercent: parseFloat(data.priceChangePercent),
                                assetType: 'cryptocurrency',
                                volume: parseFloat(data.volume),
                                high24h: parseFloat(data.highPrice),
                                low24h: parseFloat(data.lowPrice)
                            };
                        }

                        // For stocks/forex, use Finnhub or your market data provider
                        // Add your implementation here

                        return {
                            symbol: asset.symbol,
                            name: asset.symbol,
                            price: 0,
                            changePercent: 0,
                            assetType: asset.assetType
                        };
                    } catch (error) {
                        console.error(`Error fetching quote for ${asset.symbol}:`, error);
                        return {
                            symbol: asset.symbol,
                            name: asset.symbol,
                            price: 0,
                            changePercent: 0,
                            assetType: asset.assetType,
                            error: true
                        };
                    }
                })
            );

            return reply.send({
                success: true,
                data: quotes.filter(q => !q.error)
            });
        } catch (error: any) {
            console.error('Watchlist quotes error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Failed to fetch watchlist quotes'
            });
        }
    });

    // Search for assets (stocks, crypto, forex)
    app.get('/api/market/search', {
        preHandler: [authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { query } = request.query as { query: string };

            if (!query || query.length < 2) {
                return reply.send([]);
            }

            const results: any[] = [];

            // Search Binance crypto symbols
            try {
                const binanceResponse = await fetch('https://api.binance.com/api/v3/exchangeInfo');
                const binanceData = await binanceResponse.json();

                const cryptoMatches = binanceData.symbols
                    .filter((s: any) =>
                        s.symbol.includes(query.toUpperCase()) &&
                        s.quoteAsset === 'USDT'
                    )
                    .slice(0, 10)
                    .map((s: any) => ({
                        symbol: s.baseAsset,
                        displaySymbol: s.symbol,
                        description: `${s.baseAsset}/USDT`,
                        type: 'Cryptocurrency'
                    }));

                results.push(...cryptoMatches);
            } catch (error) {
                console.error('Binance search error:', error);
            }

            // Add Finnhub stock search if you have API key
            // ... your stock search implementation

            return reply.send(results);
        } catch (error: any) {
            console.error('Market search error:', error);
            return reply.status(500).send({
                success: false,
                message: error.message || 'Search failed'
            });
        }
    });
}
