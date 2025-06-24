// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore , collection, addDoc} from "firebase/firestore";

// Your Firebase web app's configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA0lHWvWExv4ytTcU3x7TzJIvmB4lG6CM",
  authDomain: "fertilizer-prediction-system.firebaseapp.com",
  projectId: "fertilizer-prediction-system",
  storageBucket: "fertilizer-prediction-system.appspot.com", // Updated this line
  messagingSenderId: "991368486231",
  appId: "1:991368486231:web:af9d715bc9cd6da409b212",
  measurementId: "G-1WNNKG39MN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth object to use it for authentication in other parts of the app
export const auth = getAuth(app);
const db = getFirestore(app);
export { firebaseConfig,db,collection,addDoc};