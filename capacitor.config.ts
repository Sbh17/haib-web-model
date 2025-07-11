import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a76af82cca3b4e4aa6d0b366b25bcb94',
  appName: 'haib-web-model',
  webDir: 'dist',
  server: {
    url: 'https://a76af82c-ca3b-4e4a-a6d0-b366b25bcb94.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;