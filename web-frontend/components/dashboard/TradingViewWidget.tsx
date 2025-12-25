"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: string | number;
}

export default function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  interval = "60",
  theme = "dark",
  height = "500px"
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const initWidget = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.TradingView && containerRef.current) {
      // Clear previous widget
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Widget cleanup:', e);
        }
        widgetRef.current = null;
      }

      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (containerRef.current) {
          try {
            // @ts-ignore
            widgetRef.current = new window.TradingView.widget({
              symbol: symbol,
              interval: interval,
              theme: theme,
              container_id: "tv_chart_container",
              autosize: true,
              timezone: "Etc/UTC",
              style: "1",
              locale: "en",
              toolbar_bg: "#0f172a",
              enable_publishing: false,
              hide_side_toolbar: false,
              allow_symbol_change: true,
              save_image: false,
              studies: [],
              show_popup_button: false,
              popup_width: "1000",
              popup_height: "650",
            });
          } catch (e) {
            console.error('Error initializing TradingView widget:', e);
          }
        }
      }, 100);
    }
  };

  // Initialize widget when script loads or when symbol/interval changes
  useEffect(() => {
    if (scriptLoaded) {
      initWidget();
    }

    // Cleanup on unmount or when symbol changes
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Widget cleanup on unmount:', e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, theme, scriptLoaded]);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  return (
    <div className="tradingview-widget-wrapper w-full h-full">
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onReady={handleScriptLoad}
      />
      <div
        id="tv_chart_container"
        ref={containerRef}
        style={{ width: "100%", height: height }}
      />
    </div>
  );
}


