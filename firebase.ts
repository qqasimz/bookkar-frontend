// firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD1vWDwtPSifqiWozblCnsG1Utc-2uj1sA',
  authDomain: 'bookkar-frontend.firebaseapp.com',
  projectId: 'bookkar-frontend',
  storageBucket: 'bookkar-frontend.firebasestorage.app',
  messagingSenderId: '581079059124',
  appId: '1:581079059124:web:633e16e8705fdf5fda25e1',
  measurementId: 'G-Q953D9M50S',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };
