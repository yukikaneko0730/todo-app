// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-6DQbzONqZT3wpgPaSYgZg1oVETP7EEY",
  authDomain: "todo-app-8584e.firebaseapp.com",
  projectId: "todo-app-8584e",
  storageBucket: "todo-app-8584e.firebasestorage.app",
  messagingSenderId: "418781762493",
  appId: "1:418781762493:web:d9e58670529c0c731138d4",
  measurementId: "G-KB5SE410LF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch(console.error);
