// types/finnhub.ts

export interface ForexSymbol {
  description: string
  displaySymbol: string
  symbol: string
}

export interface ForexRate {
  price: number
  timestamp: number
  change: number
  percentChange?: number  // ✅ Added this field
}

export interface ForexRatesResponse {
  [symbol: string]: ForexRate
}

export interface TradeData {
  s: string  // symbol
  p: number  // price
  t: number  // timestamp
  v: number  // volume
  c: string[] // conditions
}

export interface FinnhubMessage {
  type: 'trade' | 'connected' | 'subscribed' | 'unsubscribed' | 'error'
  data?: TradeData
  symbol?: string
  message?: string
  clientId?: string
}
