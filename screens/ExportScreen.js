import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function ExportScreen({ route }) {
  const username = route.params?.username || 'User';
  const [csvData, setCsvData] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `gestures/${username}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const rows = [
          [
            'gestureType',
            'timestamp',
            'scrollDistance',
            'scrollSpeed',
            'swipeDirection',
            'tapIndex',
            'screen',
          ],
        ];
        Object.values(data).forEach((entry) => {
          rows.push([
            entry.gestureType || '',
            entry.timestamp || '',
            entry.scrollDistance || '',
            entry.scrollSpeed || '',
            entry.direction || '',
            entry.tapIndex || '',
            entry.screen || '',
          ]);
        });

        const csv = rows.map((r) => r.join(',')).join('\n');
        setCsvData(csv);
      }
    });
  }, []);

  const handleExport = async () => {
    if (!csvData) {
      Alert.alert('No data to export!');
      return;
    }

    const fileUri = FileSystem.documentDirectory + `${username}_gestures.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Gesture Data CSV',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export Gesture Data</Text>
      <Text style={styles.info}>Username: {username}</Text>
      <Button
        title="📤 Export CSV"
        onPress={handleExport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#4b0082',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
});
