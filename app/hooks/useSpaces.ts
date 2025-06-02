import { useState, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Space, Thought } from '../types/spaces';
import { SpacesStorageService } from '../utils/spacesStorage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const useSpaces = () => {
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load current space on mount
  useEffect(() => {
    const loadCurrentSpace = async () => {
      setIsLoading(true);
      try {
        const currentSpaceId = await SpacesStorageService.getCurrentSpaceId();
        
        if (currentSpaceId) {
          const space = await SpacesStorageService.getSpace(currentSpaceId);
          if (space) {
            setCurrentSpace(space);
            setHasUnsavedChanges(!space.isSaved);
            return;
          }
        }
        
        // Create a new space if none exists
        const newSpace = SpacesStorageService.createNewSpace();
        setCurrentSpace(newSpace);
        await SpacesStorageService.setCurrentSpaceId(newSpace.id);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error('Failed to load current space:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentSpace();
  }, []);

  // Add a new thought to current space
  const addThought = useCallback(async (text: string) => {
    if (!currentSpace || !text.trim()) return;

    const newThought: Thought = {
      id: currentSpace.thoughts.length > 0 
        ? Math.max(...currentSpace.thoughts.map(t => t.id)) + 1 
        : 0,
      text: text.trim(),
      x: Math.random() * (SCREEN_WIDTH - 200),
      y: Math.random() * (SCREEN_HEIGHT * 0.6),
    };

    const updatedSpace: Space = {
      ...currentSpace,
      thoughts: [...currentSpace.thoughts, newThought],
      updatedAt: new Date(),
      isSaved: false,
    };

    setCurrentSpace(updatedSpace);
    setHasUnsavedChanges(true);
  }, [currentSpace]);

  // Update thought position
  const updateThoughtPosition = useCallback(async (id: number, x: number, y: number) => {
    if (!currentSpace) return;

    const updatedThoughts = currentSpace.thoughts.map(thought =>
      thought.id === id ? { ...thought, x, y } : thought
    );

    const updatedSpace: Space = {
      ...currentSpace,
      thoughts: updatedThoughts,
      updatedAt: new Date(),
      isSaved: false,
    };

    setCurrentSpace(updatedSpace);
    setHasUnsavedChanges(true);
  }, [currentSpace]);

  // Clear all thoughts in current space
  const clearAllThoughts = useCallback(async () => {
    if (!currentSpace) return;

    const updatedSpace: Space = {
      ...currentSpace,
      thoughts: [],
      updatedAt: new Date(),
      isSaved: false,
    };

    setCurrentSpace(updatedSpace);
    setHasUnsavedChanges(true);
  }, [currentSpace]);

  // Save current space
  const saveCurrentSpace = useCallback(async (name?: string) => {
    if (!currentSpace) throw new Error('No current space to save');

    const updatedSpace: Space = {
      ...currentSpace,
      name: name || currentSpace.name, // No date is added here
      updatedAt: new Date(),
      isSaved: true,
    };

    await SpacesStorageService.saveSpace(updatedSpace);
    setCurrentSpace(updatedSpace);
    setHasUnsavedChanges(false);
  }, [currentSpace]);

  // Create a new space
  const createNewSpace = useCallback(async (saveCurrentFirst: boolean = false) => {
    if (saveCurrentFirst && currentSpace && hasUnsavedChanges) {
      await saveCurrentSpace();
    }

    const newSpace = SpacesStorageService.createNewSpace();
    setCurrentSpace(newSpace);
    await SpacesStorageService.setCurrentSpaceId(newSpace.id);
    setHasUnsavedChanges(true);
  }, [currentSpace, hasUnsavedChanges, saveCurrentSpace]);

  // Load an existing space
  const loadSpace = useCallback(async (spaceId: string) => {
    const space = await SpacesStorageService.getSpace(spaceId);
    if (space) {
      setCurrentSpace(space);
      await SpacesStorageService.setCurrentSpaceId(space.id);
      setHasUnsavedChanges(!space.isSaved);
    }
  }, []);

  return {
    currentSpace,
    isLoading,
    hasUnsavedChanges,
    addThought,
    updateThoughtPosition,
    clearAllThoughts,
    saveCurrentSpace,
    createNewSpace,
    loadSpace,
  };
};