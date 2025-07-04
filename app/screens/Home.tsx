import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Text,
  Alert 
} from 'react-native';

import TopBar from './TopBar';
import InputBox from './InputBox';
import ThoughtBubble from './ThoughtBubble';
import { useSpaces } from '../hooks/useSpaces';
import OptionsMenuModal from './OptionMenuModel'; 

export default function Home() {
  const [input, setInput] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSpaceMenu, setShowSpaceMenu] = useState(false); // Add this missing state
  
  const {
    currentSpace,
    isLoading,
    hasUnsavedChanges,
    addThought,
    updateThoughtPosition,
    clearAllThoughts,
    saveCurrentSpace,
    createNewSpace,
    loadSpace, // Add this if missing from useSpaces hook
  } = useSpaces();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      await addThought(input);
      setInput('');
    } catch (error) {
      console.error('Failed to add thought:', error);
      Alert.alert('Error', 'Failed to save your thought. Please try again.');
    }
  };

  const handleSaveSpace = async (name?: string) => {
    try {
      await saveCurrentSpace(name);
      Alert.alert('Success', 'Space saved successfully!');
    } catch (error) {
      console.error('Failed to save space:', error);
      throw error;
    }
  };

  const handleCreateSpace = async () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes in the current space.!!',
        [
          {
            text: 'Don\'t Save',
            style: 'destructive',
            onPress: async () => {
              try {
                await createNewSpace(false);
              } catch (error) {
                console.error('Failed to create space:', error);
                Alert.alert('Error', 'Failed to create new space. Please try again.');
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      try {
        await createNewSpace(false);
      } catch (error) {
        console.error('Failed to create space:', error);
        Alert.alert('Error', 'Failed to create new space. Please try again.');
      }
    }
  };

  const handleOptionsPress = () => {
    // Force a clean state and delay to prevent gesture conflicts
    setShowOptionsMenu(false);
    requestAnimationFrame(() => {
      setShowOptionsMenu(true);
    });
  };

  // Close options menu properly
  const handleCloseOptionsMenu = () => {
    setShowOptionsMenu(false);
  };

  const handleOpenSettings = () => {
    Alert.alert('Settings', 'Settings menu coming soon!');
  };

  const handleOpenSpace = () => {
    setShowSpaceMenu(true);
  };

  const handleSelectSpace = async (spaceId: string) => {
    try {
      await loadSpace(spaceId);
      setShowSpaceMenu(false); // Close space menu after selection
    } catch (error) {
      console.error('Failed to load space:', error);
      Alert.alert('Error', 'Failed to load space. Please try again.');
    }
  };

  const handleClear = async () => {
    if (!currentSpace || currentSpace.thoughts.length === 0) {
      Alert.alert('No Thoughts', 'There are no thoughts to clear.');
      return;
    }

    Alert.alert(
      'Clear All Thoughts',
      'Are you sure you want to delete all thoughts in this space? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllThoughts();
              setShowOptionsMenu(false); // Close menu after clearing
              Alert.alert('Success', 'All thoughts have been cleared.');
            } catch (error) {
              console.error('Failed to clear thoughts:', error);
              Alert.alert('Error', 'Failed to clear thoughts. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDragEnd = async (id: number, x: number, y: number) => {
    try {
      await updateThoughtPosition(id, x, y);
    } catch (error) {
      console.error('Failed to update thought position:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your space...</Text>
      </View>
    );
  }

  if (!currentSpace) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load space</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar 
        title={currentSpace.name}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveSpace={handleSaveSpace}
        onCreateSpace={handleCreateSpace}
        onOptionsPress={handleOptionsPress}
      />
      
      <OptionsMenuModal
        visible={showOptionsMenu}
        onClose={handleCloseOptionsMenu} // Use proper handler
        onClearAllThoughts={handleClear}
        onOpenSettings={handleOpenSettings}
        onOpenSpace={handleOpenSpace} // Use proper handler
      />

      {/* Uncomment and fix when SpaceMenuModal is ready */}
      {/* 
      <SpaceMenuModal
        visible={showSpaceMenu}
        onClose={() => setShowSpaceMenu(false)}
        onSelectSpace={handleSelectSpace}
      />
      */}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.chatSpace}>
          {currentSpace.thoughts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Welcome to {currentSpace.name}! 💭
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Start adding your thoughts below
              </Text>
            </View>
          ) : (
            currentSpace.thoughts.map(({ id, text, x, y }) => (
              <ThoughtBubble
                key={id}
                id={id}
                text={text}
                initialX={x}
                initialY={y}
                onDragEnd={handleDragEnd}
              />
            ))
          )}
        </View>
        
        <InputBox 
          input={input} 
          setInput={setInput} 
          onSend={handleSend} 
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6F9',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatSpace: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F6F9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F6F9',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});