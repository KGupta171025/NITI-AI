import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD6s6Thpu1VxHC-f9-4hiDXlK6YDHoX7C4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "niti--ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "niti--ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "niti--ai.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1098754504398",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1098754504398:web:9a6fab5f2cc5371576829f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-SCT4H8RY9H",
};

const placeholderKeys = new Set(["", "your_firebase_api_key_here"]);

export const isFirebaseConfigured =
  !placeholderKeys.has(firebaseConfig.apiKey.trim());

function createFirebase(): { app: FirebaseApp | null; auth: Auth | null; db: Firestore | null } {
  // Never initialize during Next.js prerender/SSR. An empty or invalid API key
  // throws auth/invalid-api-key and fails Cloudflare `next build`.
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return { app: null, auth: null, db: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    if (typeof window !== "undefined") {
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.error("Firebase persistence error:", err);
      });
    }

    return { app, auth, db };
  } catch (err) {
    console.warn("Firebase initialization skipped:", err);
    return { app: null, auth: null, db: null };
  }
}

const firebase = createFirebase();

export const app = firebase.app;
export const auth = firebase.auth;
export const db = firebase.db;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

/**
 * Format Firebase Auth Error Codes into user-friendly and actionable instructions
 */
export function formatFirebaseAuthError(err: unknown): string {
  if (!err) return "An unexpected error occurred during authentication.";

  const errorObj = err as { code?: string; message?: string };
  const code = errorObj.code || "";
  const rawMessage = errorObj.message || "";

  switch (code) {
    case "auth/configuration-not-found":
      return "Firebase Authentication is not activated in project 'niti--ai'. In Firebase Console, click 'Authentication' in the left menu, then click 'Get started' and enable 'Email/Password'.";
    case "auth/unauthorized-domain":
      return "Domain unauthorized: Please add this site's domain in Firebase Console -> Authentication -> Settings -> Authorized Domains.";
    case "auth/operation-not-allowed":
      return "Sign-in method disabled: In Firebase Console -> Authentication -> Sign-in method, enable Email/Password and/or Google.";
    case "auth/user-not-found":
      return "No account found with this email. Please click 'Sign up' below to create a new account.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify your credentials or create a new account.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion. Please try again.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
      return "Invalid or missing Firebase API Key. Please verify the API key in GitHub Secrets or .env.local.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connectivity.";
    case "auth/too-many-requests":
      return "Access temporarily disabled due to too many failed login attempts. Please reset password or try again later.";
    default:
      return rawMessage || "Authentication failed. Please check your network and credentials.";
  }
}
