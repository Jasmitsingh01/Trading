/**
 * Binance API Client for Frontend
 * Fetches crypto data directly from Binance public API
 */

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export interface BinanceSymbol {
    symbol: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
    baseAssetPrecision: number;
    quoteAssetPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
}

export interface BinanceTicker {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export interface CryptoData {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    price: string;
    change: string;
    changePercent: string;
    high: string;
    low: string;
    volume: string;
    status: string;
}

/**
 * Fetch all trading symbols from Binance
 */
export async function fetchAllCryptoSymbols(): Promise<BinanceSymbol[]> {
    try {
        const response = await fetch(`${BINANCE_API_BASE}/exchangeInfo`);
        
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter active USDT pairs only
        const usdtSymbols = data.symbols.filter((symbol: BinanceSymbol) => 
            symbol.symbol.endsWith('USDT') && 
            symbol.status === 'TRADING' &&
            symbol.isSpotTradingAllowed
        );

        console.log('✅ Fetched Binance symbols:', usdtSymbols.length);
        return usdtSymbols;
    } catch (error) {
        console.error('❌ Error fetching Binance symbols:', error);
        throw error;
    }
}

/**
 * Fetch 24hr ticker data for all symbols
 */
export async function fetchAllTickers(): Promise<BinanceTicker[]> {
    try {
        const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`);
        
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }

        const tickers = await response.json();
        
        // Filter USDT pairs only
        const usdtTickers = tickers.filter((ticker: BinanceTicker) => 
            ticker.symbol.endsWith('USDT')
        );

        console.log('✅ Fetched Binance tickers:', usdtTickers.length);
        return usdtTickers;
    } catch (error) {
        console.error('❌ Error fetching Binance tickers:', error);
        throw error;
    }
}

/**
 * Fetch ticker for a specific symbol
 */
export async function fetchTickerBySymbol(symbol: string): Promise<BinanceTicker> {
    try {
        const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
        
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Error fetching ticker for ${symbol}:`, error);
        throw error;
    }
}

/**
 * Combine symbols and tickers into enriched crypto data
 */
export async function fetchAllCryptoData(): Promise<CryptoData[]> {
    try {
        // Fetch both in parallel
        const [symbols, tickers] = await Promise.all([
            fetchAllCryptoSymbols(),
            fetchAllTickers()
        ]);

        // Create a map of tickers for quick lookup
        const tickerMap = new Map<string, BinanceTicker>();
        tickers.forEach(ticker => {
            tickerMap.set(ticker.symbol, ticker);
        });

        // Combine symbol info with ticker data
        const cryptoData: CryptoData[] = symbols.map(symbol => {
            const ticker = tickerMap.get(symbol.symbol);
            
            return {
                symbol: symbol.symbol,
                baseAsset: symbol.baseAsset,
                quoteAsset: symbol.quoteAsset,
                price: ticker?.lastPrice || '0',
                change: ticker?.priceChange || '0',
                changePercent: ticker?.priceChangePercent || '0',
                high: ticker?.highPrice || '0',
                low: ticker?.lowPrice || '0',
                volume: ticker?.volume || '0',
                status: symbol.status
            };
        });

        console.log('✅ Combined crypto data:', cryptoData.length);
        return cryptoData;
    } catch (error) {
        console.error('❌ Error fetching crypto data:', error);
        throw error;
    }
}

/**
 * Paginate crypto data
 */
export function paginateCryptoData(
    data: CryptoData[],
    page: number = 1,
    limit: number = 10
): {
    data: CryptoData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
} {
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
}

/**
 * Search crypto by symbol or name
 */
export function searchCrypto(data: CryptoData[], query: string): CryptoData[] {
    const searchTerm = query.toUpperCase();
    return data.filter(crypto => 
        crypto.symbol.includes(searchTerm) ||
        crypto.baseAsset.includes(searchTerm)
    );
}

/**
 * Sort crypto data
 */
export function sortCryptoData(
    data: CryptoData[],
    sortBy: 'symbol' | 'price' | 'change' | 'volume' = 'symbol',
    order: 'asc' | 'desc' = 'asc'
): CryptoData[] {
    return [...data].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'symbol':
                comparison = a.symbol.localeCompare(b.symbol);
                break;
            case 'price':
                comparison = parseFloat(a.price) - parseFloat(b.price);
                break;
            case 'change':
                comparison = parseFloat(a.changePercent) - parseFloat(b.changePercent);
                break;
            case 'volume':
                comparison = parseFloat(a.volume) - parseFloat(b.volume);
                break;
        }

        return order === 'asc' ? comparison : -comparison;
    });
}

export default {
    fetchAllCryptoSymbols,
    fetchAllTickers,
    fetchTickerBySymbol,
    fetchAllCryptoData,
    paginateCryptoData,
    searchCrypto,
    sortCryptoData
};
