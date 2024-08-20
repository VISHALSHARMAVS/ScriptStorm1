// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "scriptstorm-f8aa2.firebaseapp.com",
  projectId: "scriptstorm-f8aa2",
  storageBucket: "scriptstorm-f8aa2.appspot.com",
  messagingSenderId: "824720521497",
  appId: "1:824720521497:web:7af3af380044cda94f6d88",
  measurementId: "G-MBKEGDHKNQ"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app); 