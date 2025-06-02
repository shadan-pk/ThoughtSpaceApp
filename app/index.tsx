import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './screens/Home';

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Home />
    </GestureHandlerRootView>
  );
}
