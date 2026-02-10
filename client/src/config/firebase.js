import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcs9mpXjj8IPLQ6iT3G4Fqd_u2xFDraZM",
  authDomain: "testing-a2fdf.firebaseapp.com",
  projectId: "testing-a2fdf",
  storageBucket: "testing-a2fdf.firebasestorage.app",
  messagingSenderId: "898123152015",
  appId: "1:898123152015:web:f34126cc67fbe56d234efa",
  measurementId: "G-YFBJCCK8TQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();