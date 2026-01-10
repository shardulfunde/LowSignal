
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT8qYLoNGvhLFxgY8hkMn2YwymkyNUiok",
  authDomain: "lowsignal-c1734.firebaseapp.com",
  projectId: "lowsignal-c1734",
  storageBucket: "lowsignal-c1734.firebasestorage.app",
  messagingSenderId: "824125067980",
  appId: "1:824125067980:web:5b62d8d3b289d4359fe869",
  measurementId: "G-7Z6W3BVCWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
