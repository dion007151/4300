import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";

// ── Firebase Project Configuration ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemo4300FirebaseApiKeyForFreeApp",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "forfree-4300.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "forfree-4300",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "forfree-4300.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "4300998811",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:4300998811:web:demo4300appid"
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
