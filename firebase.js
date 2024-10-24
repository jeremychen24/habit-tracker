import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB--CozD9sLOjjw-9hQqoMON-n9WRU8qEY",
  authDomain: "habit-tracker2-6218f.firebaseapp.com",
  projectId: "habit-tracker2-6218f",
  storageBucket: "habit-tracker2-6218f.appspot.com",
  messagingSenderId: "114728436362",
  appId: "1:114728436362:web:3f5d09ec859e442646a373",
  measurementId: "G-VG1Y80LRQ7"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
