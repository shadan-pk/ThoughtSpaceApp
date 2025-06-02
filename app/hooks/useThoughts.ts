import { useState, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { StorageService, Thought } from '../utils/storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const useThoughts = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load thoughts on mount
  useEffect(() => {
    const loadInitialThoughts = async () => {
      setIsLoading(true);
      try {
        const loadedThoughts = await StorageService.loadThoughts();
        setThoughts(loadedThoughts);
      } catch (error) {
        console.error('Failed to load thoughts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialThoughts();
  }, []);

  // Add a new thought
  const addThought = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newThought: Thought = {
      id: StorageService.getNextId(thoughts),
      text: text.trim(),
      x: Math.random() * (SCREEN_WIDTH - 200), // Account for bubble width
      y: Math.random() * (SCREEN_HEIGHT * 0.6), // Keep in upper portion
    };

    const updatedThoughts = [...thoughts, newThought];
    setThoughts(updatedThoughts);

    try {
      await StorageService.saveThoughts(updatedThoughts);
    } catch (error) {
      // Rollback on error
      setThoughts(thoughts);
      throw error;
    }
  }, [thoughts]);

  // Update thought position
  const updateThoughtPosition = useCallback(async (id: number, x: number, y: number) => {
    const updatedThoughts = thoughts.map(thought =>
      thought.id === id ? { ...thought, x, y } : thought
    );
    
    setThoughts(updatedThoughts);

    try {
      await StorageService.saveThoughts(updatedThoughts);
    } catch (error) {
      // Rollback on error
      setThoughts(thoughts);
      throw error;
    }
  }, [thoughts]);

  // Clear all thoughts
  const clearAllThoughts = useCallback(async () => {
    const previousThoughts = thoughts;
    setThoughts([]);

    try {
      await StorageService.clearThoughts();
    } catch (error) {
      // Rollback on error
      setThoughts(previousThoughts);
      throw error;
    }
  }, [thoughts]);

  // Remove a specific thought
  const removeThought = useCallback(async (id: number) => {
    const updatedThoughts = thoughts.filter(thought => thought.id !== id);
    const previousThoughts = thoughts;
    
    setThoughts(updatedThoughts);

    try {
      await StorageService.saveThoughts(updatedThoughts);
    } catch (error) {
      // Rollback on error
      setThoughts(previousThoughts);
      throw error;
    }
  }, [thoughts]);

  return {
    thoughts,
    isLoading,
    addThought,
    updateThoughtPosition,
    clearAllThoughts,
    removeThought,
  };
};