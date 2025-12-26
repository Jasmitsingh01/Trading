// Ambient module declaration for finnhub
// This file provides TypeScript type definitions for the finnhub npm package

declare module 'finnhub' {
    export interface DefaultApiClient {
        authentications: {
            api_key: {
                apiKey: string;
            };
        };
    }

    export class DefaultApi {
        constructor(apiClient?: DefaultApiClient);

        forexRates(base: string, callback: (error: any, data: any, response: any) => void): void;
        forexExchanges(callback: (error: any, data: any, response: any) => void): void;
        forexSymbols(exchange: string, callback: (error: any, data: any, response: any) => void): void;
        forexCandles(
            symbol: string,
            resolution: string,
            from: number,
            to: number,
            callback: (error: any, data: any, response: any) => void
        ): void;
        quote(symbol: string, callback: (error: any, data: any, response: any) => void): void;
        stockSymbols(exchange: string, callback: (error: any, data: any, response: any) => void): void;
        stockCandles(
            symbol: string,
            resolution: string,
            from: number,
            to: number,
            callback: (error: any, data: any, response: any) => void
        ): void;
        companyProfile2(opts: { symbol: string }, callback: (error: any, data: any, response: any) => void): void;
        newsSentiment(symbol: string, callback: (error: any, data: any, response: any) => void): void;
        marketNews(category: string, opts: any, callback: (error: any, data: any, response: any) => void): void;
    }

    export class ApiClient {
        static instance: DefaultApiClient;
    }

    const finnhub: {
        ApiClient: typeof ApiClient;
        DefaultApi: typeof DefaultApi;
    };

    export default finnhub;
}
