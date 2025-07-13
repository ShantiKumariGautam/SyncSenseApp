import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// Removed direct Firebase imports as saveGesture will handle it
// import { getDatabase, ref, push } from 'firebase/database';
// import { db } from '../firebase'; // Assuming db is exported from firebase.js
import { saveGesture } from '../utils/saveGesture'; // Import saveGesture

const { height } = Dimensions.get('window');

const FACTS = [
  {
    fact: 'Your brain processes visuals 60,000x faster than text.',
    reason: 'That’s why a picture really is worth a thousand words.',
  },
  {
    fact: 'You blink around 20 times per minute.',
    reason: "That's about 28,000 times a day — and you rarely notice.",
  },
  {
    fact: 'The Eiffel Tower grows 6 inches in summer.',
    reason: 'Heat expands the metal.',
  },
  {
    fact: 'You’re older than your teeth.',
    reason: 'Baby teeth start forming months *after* birth.',
  },
  {
    fact: 'The smell of rain is actually bacteria.',
    reason:
      'The scent, called petrichor, comes from geosmin — a compound released by soil-dwelling bacteria when it rains.',
  },

  {
    fact: 'You replace outer skin every 28 days.',
    reason: 'The dust in your room? Mostly dead skin.',
  },
  {
    fact: 'Octopuses have 3 hearts & blue blood.',
    reason: '2 hearts stop beating when they swim.',
  },
  {
    fact: ' Keep Scrolling ! ',
    reason: 'Just a few more amazing facts to go!',
    isReminder: true,
  },
  {
    fact: 'Smell is deeply tied to memory.',
    reason: 'That’s why a scent can bring instant flashbacks.',
  },
  {
    fact: 'Your brain has 100 trillion+ connections.',
    reason: 'More than stars in the Milky Way.',
  },
  {
    fact: 'Dogs can smell your emotions.',
    reason:
      'They sense changes in hormone levels like cortisol and adrenaline.',
  },
  {
    fact: 'Stomach lining renews every 3–4 days.',
    reason: 'Otherwise, your stomach would digest itself.',
  },
  {
    fact: 'The Indian Constitution is the longest in the world.',
    reason: 'It has 448 articles in 25 parts and over 100 amendments.',
  },
  {
    fact: 'One jellyfish can reverse its age.',
    reason: 'It reverts to a juvenile state when stressed.',
  },
  {
    fact: "You can't hum while holding your nose.",
    reason: "Try it — you'll fail.",
  },
  {
    fact: 'You dream but forget 90% within 10 mins.',
    reason: 'Hippocampus is less active during REM sleep.',
  },
  {
    fact: 'You can’t breathe and swallow at the same time.',
    reason: 'Your airway and food pipe intersect — one opens at a time.',
  },
  {
    fact: 'Tongue prints are more unique than fingerprints.',
    reason: 'Shape, texture, and motion make them harder to replicate.',
  },
  {
    fact: 'Goosebumps are a survival reflex.',
    reason: 'They helped animals puff fur to look bigger or stay warm.',
  },

  {
    fact: 'You feel cold when scared.',
    reason: 'Blood flows away from skin in fight-or-flight mode.',
  },
  {
    fact: 'Cracking knuckles doesn’t cause arthritis.',
    reason: 'It’s gas bubbles collapsing in joint fluid.',
  },
  {
    fact: 'The heart can beat outside the body.',
    reason: 'It has its own electrical system — needs only oxygen.',
  },
  {
    fact: 'Yawning cools your brain.',
    reason: 'It boosts blood flow and draws in cool air.',
  },
  {
    fact: 'Men and women see colors slightly differently.',
    reason: 'Women often have more cone cells for red/orange.',
  },

  {
    fact: 'Alcohol doesn’t erase memory — it blocks forming new ones.',
    reason: 'It affects the hippocampus, not storage.',
  },

  {
    fact: 'Left-handed people process emotion differently.',
    reason: 'Right hemisphere dominance affects emotional expression.',
  },
  {
    fact: 'Chewing gum boosts memory.',
    reason: 'It increases blood flow and oxygen to the brain.',
  },
];

const COLORS = [
  '#fff8e1',
  '#e8f5e9',
  '#e3f2fd',
  '#fce4ec',
  '#f3e5f5',
  '#e0f7fa',
  '#f1f8e9',
  '#ede7f6',
  '#fff3e0',
  '#fce4ec',
];

export default function ScrollScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const username = route.params?.username || 'User';
  // sessionId is still needed here if you want to pass it to ThankYouScreen
  const sessionId =
    route.params?.sessionId ||
    `session_${new Date().toISOString().split('T')[0]}`;

  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  // Refs to accumulate scroll speeds for averaging
  const scrollUpSpeeds = useRef([]);
  const scrollDownSpeeds = useRef([]);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;
    const percent = Math.min((y / (contentHeight - visibleHeight)) * 100, 100);
    setScrollProgress(percent.toFixed(0));

    const deltaY = y - lastScrollY.current;
    const timeNow = Date.now();
    const timeDiff = Math.max(timeNow - lastScrollTime.current, 1); // in ms
    const speed = deltaY / (timeDiff / 1000); // px/sec

    // Only record speed if there was actual movement
    if (Math.abs(deltaY) > 0) {
      if (deltaY < 0) {
        // Scrolling up
        scrollUpSpeeds.current.push(Math.abs(speed));
      } else if (deltaY > 0) {
        // Scrolling down
        scrollDownSpeeds.current.push(Math.abs(speed));
      }
    }

    lastScrollY.current = y;
    lastScrollTime.current = timeNow;
  };

  const calculateAverage = (speedsArray) => {
    if (speedsArray.length === 0) {
      return 0;
    }
    const sum = speedsArray.reduce((acc, speed) => acc + speed, 0);
    return Number((sum / speedsArray.length).toFixed(2));
  };

  const handleNext = async () => {
    const avgUpSpeed = calculateAverage(scrollUpSpeeds.current);
    const avgDownSpeed = calculateAverage(scrollDownSpeeds.current);

    // Use saveGesture to store the aggregated scroll data
    await saveGesture({
      username,
      gestureType: 'scrollSummary', // A new gestureType for aggregated scroll data
      screen: 'ScrollScreen',
      extraData: {
        avgScrollUpSpeed: avgUpSpeed,
        avgScrollDownSpeed: avgDownSpeed,
      },
    });
    console.log('✅ Scroll summary data saved via saveGesture');

    navigation.navigate('ThankYouScreen', { username });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Keep Scrolling to Discover Fascinating Facts
      </Text>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollArea}
      >
        {FACTS.map((item, index) => (
          <View
            key={index}
            style={[
              styles.factBox,
              {
                backgroundColor: COLORS[index % COLORS.length],
                paddingVertical: item.isReminder ? 15 : 25,
                marginVertical: item.isReminder ? 10 : 16,
              },
              item.isReminder && styles.reminderBox,
            ]}
          >
            <Text style={styles.fact}>{item.fact}</Text>
            <Text style={styles.reason}>{item.reason}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.scrollTrack}>
        <View
          style={[styles.scrollIndicator, { height: `${scrollProgress}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4b0082',
    marginBottom: 10,
  },
  scrollArea: {
    paddingBottom: 80,
  },
  factBox: {
    borderRadius: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  fact: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  reason: {
    fontSize: 15,
    color: '#444',
  },
  reminderBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4b0082',
    backgroundColor: '#f3e5f5',
  },
  button: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#4b0082',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollTrack: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 6,
    height: '80%',
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scrollIndicator: {
    backgroundColor: '#7b2cbf',
    width: '100%',
  },
});
