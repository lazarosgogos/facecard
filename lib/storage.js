import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ServerStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.get(key) || null;
  }

  setItem(key, value) {
    this.store.set(key, value);
  }

  removeItem(key) {
    this.store.delete(key);
  }
}

export const storage = Platform.OS === 'web' && typeof window === 'undefined'
  ? new ServerStorage()
  : AsyncStorage;
