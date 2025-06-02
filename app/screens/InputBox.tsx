import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Platform } from 'react-native';

type InputBoxProps = {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
};

export default function InputBox({ input, setInput, onSend }: InputBoxProps) {
  return (
    <View style={styles.inputBox}>
      <TextInput
        placeholder="What's on your mind?"
        value={input}
        onChangeText={setInput}
        multiline
        style={styles.input}
      />
      <Pressable onPress={onSend} style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.7 }]}>
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    elevation: 5,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
