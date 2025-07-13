// utils/saveGesture.js
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Optional session ID generator (daily based)
const getSessionId = () => {
  const date = new Date().toISOString().split('T')[0];
  return `session_${date}`;
};

export const saveGesture = async ({
  username,
  gestureType, // e.g. 'tap', 'swipe', 'scroll'
  screen, // e.g. 'TapScreen'
  handedness = 'right',
  extraData = {}, // any additional gesture info
}) => {
  const gestureRef = ref(db, `gestures/${username}`);

  const gestureData = {
    username,
    gestureType,
    screen,
    handedness,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    deviceModel: Device.modelName || 'Unknown',
    platform: Platform.OS,
    ...extraData,
  };

  try {
    await push(gestureRef, gestureData);
    console.log('✅ Gesture saved');
  } catch (error) {
    console.error('❌ Error saving gesture:', error);
  }
};
