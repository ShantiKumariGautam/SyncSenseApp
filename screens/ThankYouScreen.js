// // screens/ThankYouScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { Audio } from 'expo-av';

// export default function ThankYouScreen() {
//   useEffect(() => {
//     let sound;

//     const playMusic = async () => {
//       try {
//         sound = new Audio.Sound();
//         await sound.loadAsync(require('../assets/thankyou.mp3'));
//         await sound.setVolumeAsync(0.5); // Lower volume to avoid startle
//         await sound.playAsync();
//       } catch (error) {
//         console.log('Error playing thank you sound:', error);
//       }
//     };

//     playMusic();

//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/thankyou.gif')}
//         style={styles.gif}
//       />
//       <Text style={styles.message}>Thank you for your kindness! </Text>
//       <Text style={styles.footer}>~ From Team SyncSense.AI </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f0ff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   gif: {
//     width: 450,
//     height: 450,
//     resizeMode: 'contain',
//     marginBottom: 30,
//   },
//   message: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#4b0082',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   footer: {
//     fontSize: 16,
//     color: '#6c757d',
//     textAlign: 'center',
//   },
// });

// screens/ThankYouScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';

export default function ThankYouScreen() {
  useEffect(() => {
    let sound;

    const playMusic = async () => {
      try {
        sound = new Audio.Sound();
        await sound.loadAsync(require('../assets/thankyou.mp3'));
        await sound.setVolumeAsync(0.5); // Lower volume to avoid startle
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing thank you sound:', error);
      }
    };

    playMusic();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/thankyou.gif')}
        style={styles.gif}
      />
      <Text style={styles.message}>Thank you for your kindness! </Text>
      <Text style={styles.footer}>~ From Team SyncSense.AI </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gif: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4b0082',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});
