// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAckCTDBBz5WNcLbW1swYziPBglQUgVRfI",
  authDomain: "doctor-appointement-c64b2.firebaseapp.com",
  projectId: "doctor-appointement-c64b2",
  storageBucket: "doctor-appointement-c64b2.firebasestorage.app",
  messagingSenderId: "1042557108037",
  appId: "1:1042557108037:web:ae72d3574a05f5909a482c",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export default app;