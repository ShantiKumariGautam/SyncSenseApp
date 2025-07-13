


import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveGesture } from '../utils/saveGesture';

const swipeSequence = ['up', 'down', 'left', 'right'];
const emojis = {
  up: '⬆️',
  down: '⬇️',
  left: '⬅️',
  right: '➡️',
};

export default function SwipeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const username = route.params?.username || 'User';

  const currentStepRef = useRef(0);
  const [swipeMessage, setSwipeMessage] = useState('');
  const pan = useRef(new Animated.ValueXY()).current;

  const MIN_SWIPE_DISTANCE = 50;

  const swipeStartTimeRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: (_, gestureState) => {
        swipeStartTimeRef.current = Date.now();
        startXRef.current = gestureState.moveX;
        startYRef.current = gestureState.moveY;
      },

      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10,

      onPanResponderRelease: async (_, gestureState) => {
        const { dx, dy, vx, vy, moveX, moveY } = gestureState;
        const durationMs = Date.now() - swipeStartTimeRef.current;

        let detectedDirection = 'unknown';
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MIN_SWIPE_DISTANCE) {
          detectedDirection = dx > 0 ? 'right' : 'left';
        } else if (Math.abs(dy) > MIN_SWIPE_DISTANCE) {
          detectedDirection = dy < 0 ? 'up' : 'down';
        }

        const expectedDirection = swipeSequence[currentStepRef.current];
        console.log(
          `Expected: ${expectedDirection}, Detected: ${detectedDirection}`
        );

        if (detectedDirection === expectedDirection) {
          setSwipeMessage(`✅ Swiped ${expectedDirection.toUpperCase()}`);

          await saveGesture({
            username,
            gestureType: 'swipe',
            screen: 'SwipeScreen',
            extraData: {
              direction: detectedDirection,
              dx: Math.round(dx),
              dy: Math.round(dy),
              velocityX: +vx.toFixed(2),
              velocityY: +vy.toFixed(2),
              durationMs,
              startX: Math.round(startXRef.current),
              startY: Math.round(startYRef.current),
              endX: Math.round(moveX),
              endY: Math.round(moveY),
            },
          });

          if (currentStepRef.current + 1 < swipeSequence.length) {
            setTimeout(() => {
              currentStepRef.current += 1;
              setSwipeMessage('');
            }, 800);
          } else {
            setSwipeMessage('🎉 All swipes complete!');
            setTimeout(() => {
              navigation.navigate('ScrollScreen', { username });
            }, 1000);
          }
        } else {
          setSwipeMessage(
            `❌ Wrong direction! Swipe ${expectedDirection.toUpperCase()}`
          );
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const currentDirection = swipeSequence[currentStepRef.current];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi {username}, Swipe {currentDirection.toUpperCase()}{' '}
        {emojis[currentDirection]}
      </Text>

      <Animated.View
        style={[styles.swipeBox, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.emoji}>{emojis[currentDirection]}</Text>
        <Text style={styles.helper}>Swipe inside this box</Text>
      </Animated.View>

      {swipeMessage !== '' && (
        <Text style={styles.feedback}>{swipeMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#003366',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  swipeBox: {
    width: 220,
    height: 220,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderColor: '#7b2cbf',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  helper: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  feedback: {
    marginTop: 40,
    fontSize: 18,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
  },
});
