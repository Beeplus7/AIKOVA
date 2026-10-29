import 'dotenv/config';
import type { ExpoConfig, ConfigContext } from 'expo/config';

const has = (key: string) => Boolean(process.env[key]?.trim());

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'AiKOVA',
  slug: 'AiKOVA',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  scheme: 'aikova',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aikova.app',
  },
  android: {
    package: 'com.aikova.app',
    adaptiveIcon: {
      backgroundColor: '#05070D',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#05070D',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
    appUrl: process.env.EXPO_PUBLIC_APP_URL ?? '',
    githubOwner: process.env.GITHUB_OWNER ?? '',
    githubRepo: process.env.GITHUB_REPO ?? '',
    // Presence flags only — never expose tokens/secrets to the client bundle
    credentials: {
      supabase:
        has('EXPO_PUBLIC_SUPABASE_URL') && has('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
      github:
        has('GITHUB_OWNER') && has('GITHUB_REPO') && has('GITHUB_TOKEN'),
      vps: has('VPS_HOST') && has('VPS_USER') && has('EXPO_PUBLIC_API_BASE_URL'),
    },
  },
});
