import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Text 
} from 'react-native';

import TopBar from './TopBar';
import InputBox from './InputBox';
import ThoughtBubble from './ThoughtBubble';
import { useThoughts } from '../hooks/useThoughts';

export default function Home() {
  const [input, setInput] = useState('');
  const {
    thoughts,
    isLoading,
    addThought,
    updateThoughtPosition,
    clearAllThoughts,
  } = useThoughts();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      await addThought(input);
      setInput('');
    } catch (error) {
      console.error('Failed to add thought:', error);
      // You could show a toast or alert here
    }
  };

  const handleClear = async () => {
    try {
      await clearAllThoughts();
    } catch (error) {
      console.error('Failed to clear thoughts:', error);
      // You could show a toast or alert here
    }
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
        <Text style={styles.loadingText}>Loading your thoughts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Thought Space" onClear={handleClear} />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.chatSpace}>
          {thoughts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Share your thoughts! 💭
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Type something below to get started
              </Text>
            </View>
          ) : (
            thoughts.map(({ id, text, x, y }) => (
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