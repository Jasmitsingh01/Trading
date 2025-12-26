import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.BXTPRO.app',
    appName: 'BXTPRO',
    webDir: 'out',
    // No server config for production - uses built files
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
