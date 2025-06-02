import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TopBar from './TopBar';
import InputBox from './InputBox';
import ThoughtBubble from './ThoughtBubble';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Thought = {
  id: number;
  text: string;
  x: number;
  y: number;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const nextId = useRef(0);

  // Load thoughts from storage on component mount
  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const json = await AsyncStorage.getItem('@thoughts');
        if (json) {
          const loaded: Thought[] = JSON.parse(json);
          setThoughts(loaded);
          nextId.current = loaded.length > 0 ? Math.max(...loaded.map(t => t.id)) + 1 : 0;
        }
      } catch (error) {
        console.error('Error loading thoughts:', error);
      }
    };
    loadThoughts();
  }, []);

  // Save thoughts to AsyncStorage
  const saveThoughts = async (newThoughts: Thought[]) => {
    try {
      await AsyncStorage.setItem('@thoughts', JSON.stringify(newThoughts));
    } catch (error) {
      console.error('Error saving thoughts:', error);
    }
  };

  // Clear all messages
  const clearMessages = async () => {
    try {
      await AsyncStorage.removeItem('@thoughts');
      setThoughts([]);
      nextId.current = 0;
    } catch (error) {
      console.error('Error clearing thoughts:', error);
    }
  };

  // Handle sending new thought
  const handleSend = () => {
    if (!input.trim()) return;

    const id = nextId.current++;
    const x = Math.random() * (SCREEN_WIDTH - 200); // Account for bubble width
    const y = Math.random() * (SCREEN_HEIGHT * 0.6); // Keep in upper portion

    const newThought: Thought = { 
      id, 
      text: input.trim(), 
      x, 
      y 
    };
    
    const updatedThoughts = [...thoughts, newThought];
    setThoughts(updatedThoughts);
    saveThoughts(updatedThoughts);
    setInput('');
  };

  // Update thought position on drag end
  const updatePosition = (id: number, x: number, y: number) => {
    setThoughts((prevThoughts) => {
      const updatedThoughts = prevThoughts.map((thought) => 
        thought.id === id ? { ...thought, x, y } : thought
      );
      saveThoughts(updatedThoughts);
      return updatedThoughts;
    });
  };

  return (
    <View style={styles.container}>
      <TopBar title="Thought Space" onClear={clearMessages} />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.chatSpace}>
          {thoughts.map(({ id, text, x, y }) => (
            <ThoughtBubble
              key={id}
              id={id}
              text={text}
              initialX={x}
              initialY={y}
              onDragEnd={updatePosition}
            />
          ))}
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
});