#!/bin/bash

echo "🔧 Forex Live Data Fix Script"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    if grep -q "NEXT_PUBLIC_FINNHUB_API_KEY" .env.local; then
        KEY_LENGTH=$(grep "NEXT_PUBLIC_FINNHUB_API_KEY" .env.local | cut -d'=' -f2 | wc -c)
        echo "✅ Finnhub API key is configured (length: $KEY_LENGTH chars)"
        echo ""
        echo "Your forex live data should work now!"
        echo ""
        echo "Next steps:"
        echo "1. Restart your dev server: npm run dev"
        echo "2. Refresh your browser (F5)"
        echo "3. Check forex symbols - they should show live prices"
    else
        echo "❌ No Finnhub API key found in .env.local"
        echo ""
        read -p "Enter your Finnhub API key: " api_key
        echo "NEXT_PUBLIC_FINNHUB_API_KEY=$api_key" >> .env.local
        echo "✅ API key added to .env.local"
    fi
else
    echo "❌ .env.local file not found"
    echo ""
    echo "📋 Quick Setup:"
    echo ""
    echo "1. Get FREE API key: https://finnhub.io/register"
    echo "2. Enter your API key below"
    echo ""
    read -p "Enter your Finnhub API key: " api_key
    
    if [ -z "$api_key" ]; then
        echo "❌ No API key provided"
        exit 1
    fi
    
    echo "NEXT_PUBLIC_FINNHUB_API_KEY=$api_key" > .env.local
    echo "✅ Created .env.local with your API key"
fi

echo ""
echo "📖 For detailed guide, see: FIX_FOREX_LIVE_DATA.md"
echo ""
echo "🚀 Ready to restart server? (Press Ctrl+C to cancel, Enter to continue)"
read

# Restart server hint
echo "Run: npm run dev"
