

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  StyleSheet, 
} from 'react-native';
import * as Location from 'expo-location';
import { Gyroscope, DeviceMotion } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';


import { db } from '../firebase'; 
import { ref, update, push } from 'firebase/database'; 
const getSessionId = () => {
  const date = new Date().toISOString().split('T')[0];
  return `session_${date}`;
};

const GestureScreen = ({ route }) => {
  const { username } = route.params;
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;

  // Use the consistent session ID
  const sessionId = getSessionId();

  const [location, setLocation] = useState(null);
  const gestureStartTimeRef = useRef(null);

  const touchGestureData = useRef([]);
  const gyroData = useRef([]); 
  const accelData = useRef([]); 

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Save session start and location to Firebase
      const userSessionRef = ref(db, `users/${username}/${sessionId}`);
      await update(userSessionRef, {
        name: username,
        sessionStart: Date.now(),
        location: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        },
      });

      console.log('Session started and initial location saved');
    })();
  }, []); 
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        gestureStartTimeRef.current = Date.now();
      },
      onPanResponderMove: (e, gestureState) => {
        const now = Date.now();
        const duration = now - gestureStartTimeRef.current;
        const yDistance = Math.abs(gestureState.dy);
       
        const scrollSpeed = duration > 0 ? yDistance / duration : 0;
        const yNorm = e.nativeEvent.locationY / screenHeight;

        const gesture = {
          gestureType: 'touchMove', 
          x: Math.round(gestureState.moveX),
          y: Math.round(gestureState.moveY),
          yNorm: Number(yNorm.toFixed(4)),
          duration: Math.round(duration),
          scrollSpeed: Number(scrollSpeed.toFixed(2)),
          timestamp: now,
        };

        touchGestureData.current.push(gesture);
      },
      onPanResponderRelease: (e, gestureState) => {
        
      },
    })
  ).current;


  useEffect(() => {
    const gyroSub = Gyroscope.addListener((data) => {
      gyroData.current.push({
        x: Number(data.x.toFixed(4)),
        y: Number(data.y.toFixed(4)),
        z: Number(data.z.toFixed(4)),
        timestamp: Date.now(),
      });
    });

    Gyroscope.setUpdateInterval(100); 

    return () => {
      gyroSub?.remove();
    };
  }, []);


  useEffect(() => {
    const accelSub = DeviceMotion.addListener(({ acceleration }) => {
      if (acceleration) {
        accelData.current.push({
          x: Number(acceleration.x.toFixed(4)),
          y: Number(acceleration.y.toFixed(4)),
          z: Number(acceleration.z.toFixed(4)),
          timestamp: Date.now(),
        });
      }
    });

    DeviceMotion.setUpdateInterval(100); // 100ms update interval

    return () => {
      accelSub?.remove();
    };
  }, []);

  
  const handleNext = async () => {
 
    const gestureRef = ref(
      db,
      `users/${username}/${sessionId}/collectedGestures`
    );
    try {
      await push(gestureRef, {
        type: 'touchPan',
        data: touchGestureData.current,
        timestampSaved: Date.now(),
      });
      console.log(' Touch gesture data saved');
    } catch (error) {
      console.error(' Error saving touch gesture data:', error);
    }

    const gyroRef = ref(db, `users/${username}/${sessionId}/gyroscopeData`);
    try {
      await push(gyroRef, {
        type: 'gyroscope',
        data: gyroData.current,
        timestampSaved: Date.now(),
      });
      console.log(' Gyroscope data saved');
    } catch (error) {
      console.error(' Error saving gyroscope data:', error);
    }

    const accelRef = ref(
      db,
      `users/${username}/${sessionId}/accelerometerData`
    );
    try {
      await push(accelRef, {
        type: 'accelerometer',
        data: accelData.current,
        timestampSaved: Date.now(),
      });
      console.log('Accelerometer data saved');
    } catch (error) {
      console.error(' Error saving accelerometer data:', error);
    }

  
    navigation.navigate('ScrollScreen', {
      username,
      sessionId, 
    });
  };

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <Text style={styles.instructionText}>
        Touch and move your finger to generate gesture data.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40, 
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4b0082',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GestureScreen;
