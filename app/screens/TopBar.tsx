import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface TopBarProps {
  title?: string;
  onClear?: () => void;
}

export default function TopBar({
  title = 'Menu Heading',
  onClear,
}: TopBarProps) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.topBarTitle}>{title}</Text>
      {onClear && (
        <Pressable onPress={onClear}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 50,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  topBarTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  clearText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
