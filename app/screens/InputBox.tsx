import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Platform } from 'react-native';

type InputBoxProps = {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
};

export default function InputBox({ input, setInput, onSend }: InputBoxProps) {
  const handleSend = () => {
    if (input.trim()) {
      onSend();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={200}
          style={styles.input}
          textAlignVertical="top"
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable 
          onPress={handleSend} 
          style={({ pressed }) => [
            styles.sendButton, 
            pressed && styles.sendButtonPressed,
            !input.trim() && styles.sendButtonDisabled
          ]}
          disabled={!input.trim()}
        >
          <Text style={[
            styles.sendText,
            !input.trim() && styles.sendTextDisabled
          ]}>
            Send
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F2F6F9',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area for iOS
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sendTextDisabled: {
    color: '#999',
  },
});