// import React, { useEffect, useState, useRef } from 'react';
// import { View, TextInput, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSequence,
//   runOnJS,
//   withDelay,
// } from 'react-native-reanimated';

// import {
//   PanGestureHandler,
//   GestureHandlerRootView,
//   PanGestureHandlerGestureEvent,
// } from 'react-native-gesture-handler';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// type Thought = {
//   id: number;
//   text: string;
//   // Animated positions
//   x: Animated.SharedValue<number>;
//   y: Animated.SharedValue<number>;
// };

// export default function Home() {
//   const [input, setInput] = useState('');
//   const [thoughts, setThoughts] = useState<Thought[]>([]);

//   // Unique ID counter for thoughts
//   const nextId = useRef(0);

//   // Load thoughts from AsyncStorage, but since we store x/y as SharedValues, 
//   // we only store text + id, and recreate x/y on load
//   useEffect(() => {
//     const load = async () => {
//       const json = await AsyncStorage.getItem('@thoughts');
//       if (json) {
//         const loaded: { id: number; text: string }[] = JSON.parse(json);
//         const restored = loaded.map((t) => ({
//           ...t,
//           x: useSharedValue(Math.random() * (SCREEN_WIDTH - 150)), // random initial pos
//           y: useSharedValue(Math.random() * (SCREEN_HEIGHT / 2)), // upper half of screen
//         }));
//         setThoughts(restored);
//         nextId.current = loaded.length > 0 ? Math.max(...loaded.map(t => t.id)) + 1 : 0;
//       }
//     };
//     load();
//   }, []);

//   // Save only id + text to AsyncStorage (positions reset on reload)
//   const saveThoughts = async (newThoughts: Thought[]) => {
//     const toSave = newThoughts.map(({ id, text }) => ({ id, text }));
//     await AsyncStorage.setItem('@thoughts', JSON.stringify(toSave));
//   };

//   // Add new thought with animation (thrown from bottom center to random pos)
//   const handleSend = () => {
//     if (!input.trim()) return;

//     const id = nextId.current++;
//     const startX = SCREEN_WIDTH / 2 - 75; // approx center bottom (bubble width ~150)
//     const startY = SCREEN_HEIGHT - 150; // just above keyboard/input area

//     // Create SharedValues for animation start
//     const x = useSharedValue(startX);
//     const y = useSharedValue(startY);

//     // Target random position somewhere in top 60% of screen width and height
//     const targetX = Math.random() * (SCREEN_WIDTH - 150);
//     const targetY = Math.random() * (SCREEN_HEIGHT * 0.6);

//     // Create new thought object
//     const newThought: Thought = {
//       id,
//       text: input.trim(),
//       x,
//       y,
//     };

//     // Add to thoughts immediately so it renders
//     setThoughts((prev) => [...prev, newThought]);
//     saveThoughts([...thoughts, newThought]);

//     setInput('');

//     // Animate x and y with timing to target positions (throw effect)
//     x.value = withTiming(targetX, { duration: 700 });
//     y.value = withTiming(targetY, { duration: 700 });
//   };

//   // Gesture handler for drag on each thought
//   const onGestureEvent = (thought: Thought) => (event: PanGestureHandlerGestureEvent) => {
//     // Update shared values directly
//     thought.x.value += event.translationX;
//     thought.y.value += event.translationY;
//   };

//   // We need to track the gesture state for each bubble. Let's keep it simple:
//   // When gesture ends, update position to final.

//   // Animated style for each thought bubble
//   const animatedStyle = (thought: Thought) =>
//     useAnimatedStyle(() => ({
//       position: 'absolute',
//       left: thought.x.value,
//       top: thought.y.value,
//       zIndex: 10,
//     }));

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.select({ ios: 'padding', android: undefined })}
//         keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
//       >
//         {/* Top Bar */}
//         <View style={styles.topBar}>
//           <Text style={styles.topBarTitle}>Menu Heading</Text>
//           <Text style={styles.topBarPlaceholder}>Options</Text>
//         </View>

//         {/* Chat Space (empty, messages floating draggable) */}
//         <View style={styles.chatSpace}>
//           {thoughts.map((thought) => {
//             const style = animatedStyle(thought);

//             return (
//               <PanGestureHandler
//                 key={thought.id}
//                 onGestureEvent={(event) => {
//                   'worklet';
//                   // On drag, update position
//                   thought.x.value += event.translationX;
//                   thought.y.value += event.translationY;
//                   // Reset translation on each event to avoid accumulation
//                   event.translationX = 0;
//                   event.translationY = 0;
//                 }}
//               >
//                 <Animated.View style={[styles.bubble, style]}>
//                   <Text style={styles.bubbleText}>{thought.text}</Text>
//                 </Animated.View>
//               </PanGestureHandler>
//             );
//           })}
//         </View>

//         {/* Input Box */}
//         <View style={styles.inputBox}>
//           <TextInput
//             placeholder="What's on your mind?"
//             value={input}
//             onChangeText={setInput}
//             multiline
//             style={styles.input}
//           />
//           <Pressable
//             onPress={handleSend}
//             style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.7 }]}
//           >
//             <Text style={styles.sendText}>Send</Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F6F9',
//     paddingTop: 50, // leave space for top bar
//     justifyContent: 'flex-end',
//   },
//   topBar: {
//     height: 50,
//     backgroundColor: '#007AFF',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 20,
//   },
//   topBarTitle: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   topBarPlaceholder: {
//     color: 'white',
//     fontSize: 14,
//   },
//   chatSpace: {
//     flex: 1,
//     // This is the area where bubbles float
//     // No scrolling, bubbles are absolutely positioned
//   },
//   bubble: {
//     width: 150,
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 1 },
//   },
//   bubbleText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     elevation: 5,
//     marginBottom: Platform.OS === 'ios' ? 20 : 10,
//   },
//   input: {
//     flex: 1,
//     maxHeight: 100,
//     fontSize: 16,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//   },
//   sendText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
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
