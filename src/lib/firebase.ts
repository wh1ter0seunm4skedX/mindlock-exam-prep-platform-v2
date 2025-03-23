import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAB_IOQFfBsBgClxqxtWFmzPFLWnjLgFEU",
  authDomain: "mindlock-dev.firebaseapp.com",
  projectId: "mindlock-dev",
  storageBucket: "mindlock-dev.firebasestorage.app",
  messagingSenderId: "21946048671",
  appId: "1:21946048671:web:4d41690e99933f206482aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app; 