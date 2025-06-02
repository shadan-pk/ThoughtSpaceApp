import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

type ThoughtBubbleProps = {
  id: number;
  text: string;
  initialX: number;
  initialY: number;
  onDragEnd: (id: number, x: number, y: number) => void;
};

export default function ThoughtBubble({
  id,
  text,
  initialX,
  initialY,
  onDragEnd,
}: ThoughtBubbleProps) {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  const offsetX = useSharedValue(initialX);
  const offsetY = useSharedValue(initialY);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
  }));


const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
  'worklet';
  x.value = offsetX.value + event.nativeEvent.translationX;
  y.value = offsetY.value + event.nativeEvent.translationY;
};

const onGestureEnd = () => {
  'worklet';
  offsetX.value = x.value;
  offsetY.value = y.value;

  runOnJS(onDragEnd)(id, x.value, y.value);
};


  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
      <Animated.View style={[styles.bubble, animatedStyle]}>
        <Text style={styles.bubbleText}>{text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 150,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  bubbleText: {
    fontSize: 16,
    color: '#333',
  },
});
