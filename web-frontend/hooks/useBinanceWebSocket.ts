

import { useEffect, useState, useCallback, useRef } from 'react';
import { getBinanceWebSocket, type CryptoStreamData } from '@/lib/binanceWebSocket';

interface UseBinanceWebSocketOptions {
    symbol?: string;
    symbols?: string[];
    enabled?: boolean;
    onError?: (error: Error) => void;
}

interface UseBinanceWebSocketReturn {
    data: CryptoStreamData | null;
    allData: Map<string, CryptoStreamData>;
    isConnected: boolean;
    error: Error | null;
    subscribe: (symbol: string) => void;
    unsubscribe: (symbol: string) => void;
    subscribeMultiple: (symbols: string[]) => void;
}


export function useBinanceWebSocket(
    options: UseBinanceWebSocketOptions = {}
): UseBinanceWebSocketReturn {
    const { symbol, symbols, enabled = true, onError } = options;

    const [data, setData] = useState<CryptoStreamData | null>(null);
    const [allData, setAllData] = useState<Map<string, CryptoStreamData>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const wsClient = useRef(getBinanceWebSocket());
    const handlersRef = useRef<Map<string, (data: CryptoStreamData) => void>>(new Map());

    // Message handler
    const createMessageHandler = useCallback((sym: string) => {
        return (streamData: CryptoStreamData) => {
            // Update single data if this is the primary symbol
            if (sym === symbol) {
                setData(streamData);
            }

            // Update all data map
            setAllData(prev => {
                const newMap = new Map(prev);
                newMap.set(sym, streamData);
                return newMap;
            });
        };
    }, [symbol]);

    // Subscribe to symbol
    const subscribe = useCallback((sym: string) => {
        if (!enabled) return;

        const handler = createMessageHandler(sym);
        handlersRef.current.set(sym, handler);
        wsClient.current.subscribe(sym, handler);
        setIsConnected(true);
    }, [enabled, createMessageHandler]);

    // Unsubscribe from symbol
    const unsubscribe = useCallback((sym: string) => {
        const handler = handlersRef.current.get(sym);
        if (handler) {
            wsClient.current.unsubscribe(sym, handler);
            handlersRef.current.delete(sym);
            
            // Remove from allData
            setAllData(prev => {
                const newMap = new Map(prev);
                newMap.delete(sym);
                return newMap;
            });
        }

        // Update connection status
        if (handlersRef.current.size === 0) {
            setIsConnected(false);
        }
    }, []);

    // Subscribe to multiple symbols
    const subscribeMultiple = useCallback((syms: string[]) => {
        syms.forEach(sym => subscribe(sym));
    }, [subscribe]);

    // Error handler
    useEffect(() => {
        const errorHandler = (err: Error) => {
            setError(err);
            if (onError) {
                onError(err);
            }
        };

        wsClient.current.onError(errorHandler);
    }, [onError]);

    // Status handler
    useEffect(() => {
        const statusHandler = (status: 'connected' | 'disconnected' | 'error') => {
            setIsConnected(status === 'connected');
            if (status === 'error') {
                setError(new Error('WebSocket connection error'));
            }
        };

        wsClient.current.onStatus(statusHandler);
    }, []);

    // Auto-subscribe to symbol/symbols
    useEffect(() => {
        if (!enabled) return;

        if (symbol) {
            subscribe(symbol);
            return () => unsubscribe(symbol);
        }

        if (symbols && symbols.length > 0) {
            subscribeMultiple(symbols);
            return () => {
                symbols.forEach(sym => unsubscribe(sym));
            };
        }
    }, [symbol, symbols, enabled, subscribe, unsubscribe, subscribeMultiple]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Unsubscribe all handlers created by this hook
            handlersRef.current.forEach((handler, sym) => {
                wsClient.current.unsubscribe(sym, handler);
            });
            handlersRef.current.clear();
        };
    }, []);

    return {
        data,
        allData,
        isConnected,
        error,
        subscribe,
        unsubscribe,
        subscribeMultiple
    };
}

/**
 * Hook to get real-time price for a single symbol
 * Simplified version that only returns price data
 */
export function useCryptoPrice(symbol: string, enabled: boolean = true) {
    const { data, isConnected, error } = useBinanceWebSocket({ symbol, enabled });

    return {
        price: data?.price || '0',
        change: data?.changePercent || '0',
        high: data?.high || '0',
        low: data?.low || '0',
        volume: data?.volume || '0',
        isConnected,
        error
    };
}

/**
 * Hook to get real-time prices for multiple symbols
 */
export function useCryptoPrices(symbols: string[], enabled: boolean = true) {
    const { allData, isConnected, error } = useBinanceWebSocket({ symbols, enabled });

    const prices = Array.from(allData.entries()).map(([symbol, data]) => ({
        symbol,
        price: data.price,
        change: data.changePercent,
        high: data.high,
        low: data.low,
        volume: data.volume
    }));

    return {
        prices,
        allData,
        isConnected,
        error
    };
}

export default useBinanceWebSocket;
