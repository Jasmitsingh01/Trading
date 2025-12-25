// finnhubForexWS.js - Finnhub WebSocket for Live Forex Data
// Usage: node finnhubForexWS.js
// Add to .env: FINNHUB_API_KEY=your_free_key_here

const WebSocket = require('ws');
require('dotenv').config();

class FinnhubForexWS {
  constructor(apiKey, symbols = ['OANDA:EUR_USD', 'OANDA:GBP_USD', 'OANDA:USD_INR']) {
    this.apiKey = apiKey;
    this.symbols = symbols;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnects = 5;
  }

  connect() {
    const wsUrl = `wss://ws.finnhub.io?token=${this.apiKey}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      console.log('✅ Finnhub Forex WS Connected');
      this.subscribeToSymbols();
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(message);
    });

    this.ws.on('close', () => {
      console.log('❌ Finnhub WS Closed - Reconnecting...');
      this.reconnect();
    });

    this.ws.on('error', (error) => {
      console.error('⚠️ Finnhub WS Error:', error.message);
    });
  }

  subscribeToSymbols() {
    this.symbols.forEach(symbol => {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbol: symbol
      }));
      console.log(`📡 Subscribed to ${symbol}`);
    });
  }

  handleMessage(message) {
    if (message.type === 'trade') {
      const trade = message.data[0];
      const istTime = new Date(trade.t * 1000 + 19800000).toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour12: false 
      });
      
      console.log(`💹 ${trade.s} | Price: ${trade.p} | Size: ${trade.s} | Time: ${istTime}`);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnects) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnects}`);
        this.connect();
      }, 5000 * this.reconnectAttempts);
    } else {
      console.error('💥 Max reconnects reached');
    }
  }
}

// Usage
const apiKey = 'd4klrkhr01qvpdol2pf0d4klrkhr01qvpdol2pfg';
if (!apiKey) {
  console.error('❌ Add FINNHUB_API_KEY to .env file');
  process.exit(1);
}

const forexSymbols = [
  'OANDA:EUR_USD',
  'OANDA:GBP_USD', 
  'OANDA:USD_JPY',
  'OANDA:USD_INR',
  'OANDA:AUD_USD'
];

const forexWS = new FinnhubForexWS(apiKey, forexSymbols);
forexWS.connect();

process.on('SIGINT', () => {
  console.log('\n👋 Closing Finnhub WS');
  forexWS.ws?.close();
  process.exit(0);
});
