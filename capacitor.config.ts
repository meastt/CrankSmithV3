import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.cranksmith.mobile',
  appName: 'CrankSmith',
  webDir: 'public',
  server: {
    // url: 'http://localhost:3000', // Use for local development
    url: 'https://cranksmith.com', // Use for production
    cleartext: true,
    allowNavigation: [
      'localhost',
      'cranksmith.com',
      '*.cranksmith.com',
      '*.clerk.accounts.dev',
      '*.clerk.com'
    ]
  },
  plugins: {
    StatusBar: {
      style: 'DARK',           // Light text on dark background
      backgroundColor: '#030712', // Match app background
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#030712',
      showSpinner: true,
      spinnerColor: '#06b6d4',   // cyan-500 to match brand
      splashImmersive: true,
    },
    Keyboard: {
      resize: KeyboardResize.Body, // Resize the webview when keyboard appears
      resizeOnFullScreen: true,
    },
  },
};

export default config;
