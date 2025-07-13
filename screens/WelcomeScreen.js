import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleStart = () => {
    if (username.trim() !== '') {
      navigation.navigate('TapScreen', { username });
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png.jpg')}
        style={styles.logo}
      />

      {/* Heading */}
      <Text style={styles.heading}>
        Welcome to <Text style={styles.brand}>SyncSense.AI</Text>
      </Text>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Security that Syncs with your every Move
      </Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Start Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleStart}
      >
        <Text style={styles.buttonText}>Start Logging Gestures </Text>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footer}>Made with ❤️ by Team SyncSense.AI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
    marginBottom: 1,
  },

  heading: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#4b0082',
    textAlign: 'center',
    marginBottom: 1,
  },
  brand: {
    color: '#7b2cbf',
  },
  tagline: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#7b2cbf',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#7b2cbf',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: '#888',
    position: 'absolute',
    bottom: 40,
  },
});
