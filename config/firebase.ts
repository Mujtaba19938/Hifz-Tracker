import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your API key
  authDomain: "hifz-tracker-xxxxx.firebaseapp.com", // Replace with your project domain
  projectId: "hifz-tracker-xxxxx", // Replace with your project ID
  storageBucket: "hifz-tracker-xxxxx.appspot.com", // Replace with your storage bucket
  messagingSenderId: "123456789012", // Replace with your sender ID
  appId: "1:123456789012:web:abcdefghijklmnop" // Replace with your app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
