// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsyLKCcmTzGD2X8Fezi7K5fE_dq8Udcro",
  authDomain: "instant-reward-app-6369d.firebaseapp.com",
  projectId: "instant-reward-app-6369d",
  storageBucket: "instant-reward-app-6369d.firebasestorage.app",
  messagingSenderId: "732474692220",
  appId: "1:732474692220:web:482bb2a477cfc7c3246ff9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
