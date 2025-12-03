import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cranksmith.mobile',
  appName: 'CrankSmith',
  webDir: 'public',
  server: {
    url: 'https://cranksmith.com',
    androidScheme: 'https',
    allowNavigation: [
      'cranksmith.com',
      '*.cranksmith.com'
    ]
  }
};

export default config;
