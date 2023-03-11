// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTOJJahYK8CjePLAMwZ6gHWJ-3IxDAcQg",
  authDomain: "cs378-p4-11426.firebaseapp.com",
  databaseURL: "https://cs378-p4-11426-default-rtdb.firebaseio.com",
  projectId: "cs378-p4-11426",
  storageBucket: "cs378-p4-11426.appspot.com",
  messagingSenderId: "499068066802",
  appId: "1:499068066802:web:f47e119236341b0601e96b",
  measurementId: "G-M5KBVCPG38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
