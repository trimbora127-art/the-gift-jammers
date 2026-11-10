import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALEvFe6hCI_yMPmqydTvfRMix2vwsDYnQ",
  authDomain: "the-gift-jammers-d979d.firebaseapp.com",
  projectId: "the-gift-jammers-d979d",
  storageBucket: "the-gift-jammers-d979d.firebasestorage.app",
  messagingSenderId: "54194773816",
  appId: "1:54194773816:web:d22dd818b3d67a79a7abcd",
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;