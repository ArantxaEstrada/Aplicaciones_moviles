// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV0wOuIn5TiqQl45BY15IbMMvgb5CzBZs",
  authDomain: "aplicaionesmoviles-1ff91.firebaseapp.com",
  projectId: "aplicaionesmoviles-1ff91",
  storageBucket: "aplicaionesmoviles-1ff91.firebasestorage.app",
  messagingSenderId: "526135987302",
  appId: "1:526135987302:web:36ce2d0b76a775796531a7",
  measurementId: "G-12T877RKDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);