// screens/TapScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveGesture } from '../utils/saveGesture';
import * as Location from 'expo-location';

export default function TapScreen() {
  const [tapped, setTapped] = useState(Array(10).fill(false));
  const [tapCount, setTapCount] = useState(0);
  const [location, setLocation] = useState(null); 
  const navigation = useNavigation();
  const route = useRoute();
  const username = route.params?.username || 'User';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location access is required to record gesture data accurately.'
        );
        return;
      }

      try {
      
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation); // Store the full object
        console.log('TapScreen: Location obtained');
      } catch (error) {
        console.error(' TapScreen: Error getting location:', error);
        Alert.alert(
          'Location Error',
          'Could not get current location. Tap data will be saved without location details.'
        );
      }
    })();
  }, []);

  const handleTap = async (index, event) => {
    if (tapped[index]) return;

    const newTaps = [...tapped];
    newTaps[index] = true;
    const newCount = tapCount + 1;

    setTapped(newTaps);
    setTapCount(newCount);

    const { locationX, locationY, timestamp, force } = event.nativeEvent;

    const extraData = {
      x: Math.round(locationX),
      y: Math.round(locationY),
      pressure: force || 0,
      tapNumber: newCount,
    };

 
    if (location && location.coords) {
    
      extraData.latitude =
        typeof location.coords.latitude === 'number'
          ? location.coords.latitude
          : null;
      extraData.longitude =
        typeof location.coords.longitude === 'number'
          ? location.coords.longitude
          : null;
 
      extraData.locationTimestamp =
        typeof location.timestamp === 'number'
          ? location.timestamp
          : Date.now();
    } else {
      console.warn(
        'Location not available or incomplete when saving tap gesture.'
      );
   
      extraData.latitude = null;
      extraData.longitude = null;
      extraData.locationTimestamp = null;
    }

    await saveGesture({
      username,
      gestureType: 'tap',
      screen: 'TapScreen',
      extraData: extraData,
    });

    if (newCount === 10) {
      Alert.alert('Nice Tap!', `You've tapped ${newCount} times`);
      setTimeout(() => {
        navigation.navigate('SwipeScreen', { username });
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi {username}, Tap all 10 circles to continue 👇
      </Text>
      <View style={styles.circleContainer}>
        {tapped.map((isTapped, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.circle,
              { backgroundColor: isTapped ? '#7b2cbf' : '#eee' },
            ]}
            onPress={(e) => handleTap(i, e)}
          />
        ))}
      </View>
      <Text style={styles.counter}>Taps: {tapCount}/10</Text>
      {location && location.coords ? (
        <Text style={styles.locationInfo}>
          Location: {location.coords.latitude.toFixed(4)},{' '}
          {location.coords.longitude.toFixed(4)}
        </Text>
      ) : (
        <Text style={styles.locationInfo}>Getting location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6ff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#4b0082',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '90%',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  counter: {
    marginTop: 30,
    fontSize: 16,
    color: '#555',
  },
  locationInfo: {
    marginTop: 15,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});
