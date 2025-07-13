import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AppState,
} from 'react-native';
import firebase from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const appState = useRef(AppState.currentState);
  const sessionStartTimeRef = useRef(Date.now());

  // Session Tracking Logic
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        const endTime = Date.now();
        const duration = endTime - sessionStartTimeRef.current;

        if (name.trim()) {
          const userRef = firebase
            .database()
            .ref(`users/${name.trim()}/sessions`);
          userRef.push({
            startTime: sessionStartTimeRef.current,
            endTime: endTime,
            duration: duration,
          });
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [name]);

  const handleStart = () => {
    if (!name.trim()) return;
    navigation.navigate('Gesture', { username: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SyncSense.AI</Text>
      <Text style={styles.tagline}>
        Security that Syncs with your every Move.
      </Text>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleStart}
      >
        <Text style={styles.buttonText}>Start Logging</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Note: This app collects gesture data for AI model training purposes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6a0dad',
    marginBottom: 10,
  },
  tagline: { fontSize: 16, color: '#444', marginBottom: 30 },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6a0dad',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  note: { color: '#666', fontSize: 12, textAlign: 'center' },
});
