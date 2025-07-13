import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBzbck2gVQuXTJ-WFzEOH-I3RaqXoiTvUA',
  authDomain: 'syncsenseapp-3a368.firebaseapp.com',
  databaseURL: 'https://syncsenseapp-3a368-default-rtdb.firebaseio.com',
  projectId: 'syncsenseapp-3a368',
  storageBucket: 'syncsenseapp-3a368.appspot.com',
  messagingSenderId: '873249788791',
  appId: '1:873249788791:web:814a68fee6e3012c6cc772',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
