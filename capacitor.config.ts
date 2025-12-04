import type { CapacitorConfig } from '@capacitor/cli';

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
  }
};

export default config;
