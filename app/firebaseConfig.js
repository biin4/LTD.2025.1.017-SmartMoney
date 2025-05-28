// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDP_G6zWFkHUR1LNcZuUk3TPk5FaYUoHnQ",
  authDomain: "smartmoney-c5759.firebaseapp.com",
  projectId: "smartmoney-c5759",
  storageBucket: "smartmoney-c5759.firebasestorage.app",
  messagingSenderId: "479405196700",
  appId: "1:479405196700:web:f034e2a00a242f9312f459"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
