// @ts-ignore
import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";

// ── Firebase Project Configuration ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAKuRXxbrVYZEPM5x-HvyV30rV06sFzgn4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "project-1493722884173956437.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-1493722884173956437",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "project-1493722884173956437.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "79258369289",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:79258369289:web:0904256f7fdbcf51b227d8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4CW92CLMSX"
};

// Initialize Firebase App (Singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export interface FirebaseUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  idToken: string;
}

/**
 * Sign in using Google Auth Popup via Firebase.
 */
export async function signInWithGoogleFirebase(): Promise<FirebaseUserInfo> {
  const result = await signInWithPopup(auth, googleProvider);
  const user: User = result.user;
  const idToken = await user.getIdToken();

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    idToken,
  };
}

/**
 * Sign out of Firebase Auth.
 */
export async function signOutFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}
