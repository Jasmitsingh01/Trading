import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tradevault.app',
  appName: 'TradeVault',
  webDir: 'out', // Changed from 'public' to match Next.js output
  server: {
    // Use your machine's hostname or IP for development
    // Comment this out for production builds
    url: 'http://192.168.1.48:3000/dashboard',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#10b981',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#10b981',
    },
  },
};

export default config;

