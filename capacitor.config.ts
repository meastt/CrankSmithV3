import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cranksmith.app',
  appName: 'CrankSmith',
  webDir: 'public',
  server: {
    url: 'https://cranksmith.com',
    androidScheme: 'https'
  }
};

export default config;
