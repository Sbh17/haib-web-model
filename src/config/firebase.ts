
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0SwQnaMwmqX-Gwg1HdlGpMv7LmpOjajc",
  authDomain: "haib-command-center.firebaseapp.com",
  projectId: "haib-command-center",
  storageBucket: "haib-command-center.firebasestorage.app",
  messagingSenderId: "865630549304",
  appId: "1:865630549304:web:9d9b78538e5bdd1977bdcd",
  measurementId: "G-BWFV6TJXPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
