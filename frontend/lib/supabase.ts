import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isServer = typeof window === 'undefined';

/**
 * Memory storage fallback for SSR/Node environments
 */
class MemoryStorage {
  private storage: Record<string, string> = {};
  getItem(key: string) { return this.storage[key] || null; }
  setItem(key: string, value: string) { this.storage[key] = value; }
  removeItem(key: string) { delete this.storage[key]; }
}

const memoryStorage = new MemoryStorage();

/**
 * Custom storage adapter:
 * - SSR: MemoryStorage
 * - Native/Web: AsyncStorage
 * Using AsyncStorage for Native to avoid SecureStore's 2KB limit on certain Android devices.
 */
const SupabaseStorageAdapter = {
  getItem: (key: string) => {
    if (isServer) return memoryStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (isServer) return memoryStorage.setItem(key, value);
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (isServer) return memoryStorage.removeItem(key);
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SupabaseStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Required for React Native
  },
});
