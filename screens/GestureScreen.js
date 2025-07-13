// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   PanResponder,
//   Text,
//   Alert,
//   Dimensions,
//   TouchableOpacity,
// } from 'react-native';
// import * as Location from 'expo-location';
// import { Gyroscope, DeviceMotion } from 'expo-sensors';
// import { useNavigation } from '@react-navigation/native';

// import gestureList from './gestureStore'; // ✅ shared gesture store
// import { db } from '../firebase'; // ✅ correct firebase import
// import { ref, update } from 'firebase/database';

// const GestureScreen = ({ route }) => {
//   const { username } = route.params;
//   const navigation = useNavigation();
//   const screenHeight = Dimensions.get('window').height;

//   const sessionId = `session_${Date.now()}`; // ✅ unique session ID

//   const [location, setLocation] = useState(null);
//   const gestureStartTimeRef = useRef(null);

//   const gyroList = useRef([]);
//   const accelList = useRef([]);

//   // 1️⃣ Get location and start session
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location access is required.');
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);

//       const userRef = ref(db, `users/${username}/${sessionId}`);
//       await update(userRef, {
//         name: username,
//         sessionStart: Date.now(),
//         location: {
//           latitude: loc.coords.latitude,
//           longitude: loc.coords.longitude,
//           timestamp: loc.timestamp,
//         },
//       });

//       console.log('✅ Session started');
//     })();
//   }, []);

//   // 2️⃣ Gesture tracking
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         gestureStartTimeRef.current = Date.now();
//       },
//       onPanResponderMove: (e, gestureState) => {
//         const now = Date.now();
//         const duration = now - gestureStartTimeRef.current;
//         const yDistance = Math.abs(gestureState.dy);
//         const scrollSpeed = yDistance / duration;
//         const yNorm = e.nativeEvent.locationY / screenHeight;

//         const gesture = {
//           gestureType: 'touch',
//           x: gestureState.moveX,
//           y: gestureState.moveY,
//           yNorm,
//           duration,
//           scrollSpeed,
//           timestamp: now,
//         };

//         gestureList.current.push(gesture);
//       },
//     })
//   ).current;

//   // 3️⃣ Gyroscope
//   useEffect(() => {
//     const gyroSub = Gyroscope.addListener((data) => {
//       gyroList.current.push({ ...data, timestamp: Date.now() });
//     });

//     Gyroscope.setUpdateInterval(100);

//     return () => {
//       gyroSub?.remove();
//     };
//   }, []);

//   // 4️⃣ Acceleration
//   useEffect(() => {
//     const accelSub = DeviceMotion.addListener(({ acceleration }) => {
//       if (acceleration) {
//         accelList.current.push({
//           x: acceleration.x,
//           y: acceleration.y,
//           z: acceleration.z,
//           timestamp: Date.now(),
//         });
//       }
//     });

//     DeviceMotion.setUpdateInterval(100);

//     return () => {
//       accelSub?.remove();
//     };
//   }, []);

//   // 5️⃣ Navigate to ScrollScreen
//   const handleNext = () => {
//     navigation.navigate('ScrollScreen', {
//       username,
//       sessionId,
//     });
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#F5F5F5',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//       {...panResponder.panHandlers}
//     >
//       <Text
//         style={{
//           fontSize: 18,
//           color: '#333',
//           textAlign: 'center',
//           marginBottom: 20,
//         }}
//       >
//         Touch and move your finger to generate gesture data.
//       </Text>

//       <TouchableOpacity
//         style={{
//           backgroundColor: '#4b0082',
//           paddingVertical: 14,
//           paddingHorizontal: 25,
//           borderRadius: 12,
//         }}
//         onPress={handleNext}
//       >
//         <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
//           Next
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default GestureScreen;

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  StyleSheet, // Added StyleSheet for better styling
} from 'react-native';
import * as Location from 'expo-location';
import { Gyroscope, DeviceMotion } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';

// Assuming gestureStore is a simple ref or global array for temporary accumulation
// For persistent storage, we will explicitly save to Firebase here.
// import gestureList from './gestureStore'; // Removed this import as we'll handle saving here

import { db } from '../firebase'; // Correct firebase import
import { ref, update, push } from 'firebase/database'; // Added push for data lists

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

  const touchGestureData = useRef([]); // To accumulate touch data from PanResponder
  const gyroData = useRef([]); // To accumulate gyroscope data
  const accelData = useRef([]); // To accumulate accelerometer data

  // 1️⃣ Get location and start session
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

      console.log('✅ Session started and initial location saved');
    })();
  }, []); // Empty dependency array means this runs once on mount

  // 2️⃣ Gesture tracking (PanResponder)
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
        // Avoid division by zero if duration is 0
        const scrollSpeed = duration > 0 ? yDistance / duration : 0;
        const yNorm = e.nativeEvent.locationY / screenHeight;

        const gesture = {
          gestureType: 'touchMove', // More specific type
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
        // You might want to save a 'touchEnd' event or process the accumulated touchGestureData here
        // For now, we'll save all accumulated data on 'Next'
      },
    })
  ).current;

  // 3️⃣ Gyroscope
  useEffect(() => {
    const gyroSub = Gyroscope.addListener((data) => {
      gyroData.current.push({
        x: Number(data.x.toFixed(4)),
        y: Number(data.y.toFixed(4)),
        z: Number(data.z.toFixed(4)),
        timestamp: Date.now(),
      });
    });

    Gyroscope.setUpdateInterval(100); // 100ms update interval

    return () => {
      gyroSub?.remove();
    };
  }, []);

  // 4️⃣ Acceleration (DeviceMotion)
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

  // 5️⃣ Navigate to ScrollScreen and save accumulated data
  const handleNext = async () => {
    // Save all accumulated gesture and sensor data to Firebase
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
      console.log('✅ Touch gesture data saved');
    } catch (error) {
      console.error('❌ Error saving touch gesture data:', error);
    }

    const gyroRef = ref(db, `users/${username}/${sessionId}/gyroscopeData`);
    try {
      await push(gyroRef, {
        type: 'gyroscope',
        data: gyroData.current,
        timestampSaved: Date.now(),
      });
      console.log('✅ Gyroscope data saved');
    } catch (error) {
      console.error('❌ Error saving gyroscope data:', error);
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
      console.log('✅ Accelerometer data saved');
    } catch (error) {
      console.error('❌ Error saving accelerometer data:', error);
    }

    // Navigate to the next screen, passing the consistent sessionId
    navigation.navigate('ScrollScreen', {
      username,
      sessionId, // Pass the consistent session ID
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
    marginBottom: 40, // Increased margin for better spacing
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4b0082',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 3, // Added subtle shadow
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
