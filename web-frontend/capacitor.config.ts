import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tradevault.app',
  appName: 'TradeVault',
  webDir: 'public',
  server: {
    // Use your machine's hostname or IP
    url: 'http://192.168.1.48:3000',
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
