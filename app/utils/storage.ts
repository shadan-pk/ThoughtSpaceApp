import AsyncStorage from '@react-native-async-storage/async-storage';

export type Thought = {
  id: number;
  text: string;
  x: number;
  y: number;
};

const STORAGE_KEY = '@thoughts';

export class StorageService {
  /**
   * Load thoughts from AsyncStorage
   */
  static async loadThoughts(): Promise<Thought[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error loading thoughts:', error);
      return [];
    }
  }

  /**
   * Save thoughts to AsyncStorage
   */
  static async saveThoughts(thoughts: Thought[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
    } catch (error) {
      console.error('Error saving thoughts:', error);
      throw error;
    }
  }

  /**
   * Clear all thoughts from AsyncStorage
   */
  static async clearThoughts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing thoughts:', error);
      throw error;
    }
  }

  /**
   * Get the next available ID for a new thought
   */
  static getNextId(thoughts: Thought[]): number {
    return thoughts.length > 0 ? Math.max(...thoughts.map(t => t.id)) + 1 : 0;
  }
}