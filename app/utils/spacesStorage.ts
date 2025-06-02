import AsyncStorage from '@react-native-async-storage/async-storage';
import { Space, SpaceMetadata, Thought } from '../types/spaces';

const SPACES_KEY = '@spaces';
const CURRENT_SPACE_KEY = '@current_space';

export class SpacesStorageService {
  /**
   * Generate a unique ID for a new space
   */
  static generateSpaceId(): string {
    return `space_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new space
   */
//   static createNewSpace(name?: string): Space {
//     const id = this.generateSpaceId();
//     const now = new Date();
    
//     return {
//       id,
//       name: name || `Space ${new Date().toLocaleDateString()}`,
//       thoughts: [],
//       createdAt: now,
//       updatedAt: now,
//       isSaved: false,
//     };
//   }

/**
 * Create a new space
 */
static createNewSpace(name?: string): Space {
  const id = this.generateSpaceId();
  const now = new Date();
  
  return {
    id,
    name: name || `Space`, // Changed to remove date
    thoughts: [],
    createdAt: now,
    updatedAt: now,
    isSaved: false,
  };
}

  /**
   * Get all saved spaces metadata
   */
  static async getSpacesMetadata(): Promise<SpaceMetadata[]> {
    try {
      const json = await AsyncStorage.getItem(SPACES_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error loading spaces metadata:', error);
      return [];
    }
  }

  /**
   * Save spaces metadata
   */
  static async saveSpacesMetadata(spaces: SpaceMetadata[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
    } catch (error) {
      console.error('Error saving spaces metadata:', error);
      throw error;
    }
  }

  /**
   * Get a specific space by ID
   */
  static async getSpace(spaceId: string): Promise<Space | null> {
    try {
      const json = await AsyncStorage.getItem(`@space_${spaceId}`);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Error loading space:', error);
      return null;
    }
  }

  /**
   * Save a space
   */
  static async saveSpace(space: Space): Promise<void> {
    try {
      // Save the full space data
      await AsyncStorage.setItem(`@space_${space.id}`, JSON.stringify(space));
      
      // Update spaces metadata
      const spacesMetadata = await this.getSpacesMetadata();
      const existingIndex = spacesMetadata.findIndex(s => s.id === space.id);
      
      const metadata: SpaceMetadata = {
        id: space.id,
        name: space.name,
        createdAt: space.createdAt,
        updatedAt: space.updatedAt,
        thoughtCount: space.thoughts.length,
      };

      if (existingIndex >= 0) {
        spacesMetadata[existingIndex] = metadata;
      } else {
        spacesMetadata.push(metadata);
      }

      await this.saveSpacesMetadata(spacesMetadata);
    } catch (error) {
      console.error('Error saving space:', error);
      throw error;
    }
  }

  /**
   * Delete a space
   */
  static async deleteSpace(spaceId: string): Promise<void> {
    try {
      // Remove the space data
      await AsyncStorage.removeItem(`@space_${spaceId}`);
      
      // Update spaces metadata
      const spacesMetadata = await this.getSpacesMetadata();
      const filteredSpaces = spacesMetadata.filter(s => s.id !== spaceId);
      await this.saveSpacesMetadata(filteredSpaces);
    } catch (error) {
      console.error('Error deleting space:', error);
      throw error;
    }
  }

  /**
   * Get current space ID
   */
  static async getCurrentSpaceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CURRENT_SPACE_KEY);
    } catch (error) {
      console.error('Error getting current space ID:', error);
      return null;
    }
  }

  /**
   * Set current space ID
   */
  static async setCurrentSpaceId(spaceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_SPACE_KEY, spaceId);
    } catch (error) {
      console.error('Error setting current space ID:', error);
      throw error;
    }
  }

  /**
   * Clear current space ID
   */
  static async clearCurrentSpaceId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_SPACE_KEY);
    } catch (error) {
      console.error('Error clearing current space ID:', error);
      throw error;
    }
  }
}