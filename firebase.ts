// firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3pqNDxdBfC4_adbclS9Cf28XOiJNjhg8",
  authDomain: "bookar-7d15e.firebaseapp.com",
  projectId: "bookar-7d15e",
  storageBucket: "bookar-7d15e.firebasestorage.app",
  messagingSenderId: "1041392481369",
  appId: "1:1041392481369:web:134b1ba5840e4dd2a6ed48",
  measurementId: "G-D05KRND9X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };
