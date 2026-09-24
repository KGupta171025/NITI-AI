import { create } from "zustand";
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, appleProvider, formatFirebaseAuthError } from "@/lib/firebase";
import { UserAccount } from "@niti-ai/types";

interface AuthState {
  user: UserAccount | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  signInAsDemoUser: () => void;
  signOut: () => Promise<void>;
  clearError: () => void;
  setOnboarded: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  error: null,

  initialize: () => {
    // Check if demo user is active in session
    if (typeof window !== "undefined") {
      const demoSession = localStorage.getItem("niti_demo_session");
      if (demoSession) {
        try {
          const parsed = JSON.parse(demoSession);
          set({ user: parsed, isLoading: false, error: null });
          return () => {};
        } catch {
          localStorage.removeItem("niti_demo_session");
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Read onboarding flag from localStorage if available
        const localOnboarded = typeof window !== "undefined" 
          ? localStorage.getItem(`onboarded_${fbUser.uid}`) === "true" 
          : false;

        const account: UserAccount = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "Entrepreneur",
          photoURL: fbUser.photoURL,
          phoneNumber: fbUser.phoneNumber,
          providerId: fbUser.providerData[0]?.providerId || "password",
          role: "entrepreneur",
          isOnboarded: localOnboarded,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: fbUser.metadata.lastSignInTime || new Date().toISOString(),
        };

        // Sync user record to Firestore database
        try {
          const userDoc = doc(db, "users", fbUser.uid);
          setDoc(userDoc, {
            uid: account.uid,
            email: account.email,
            displayName: account.displayName,
            lastLoginAt: account.lastLoginAt
          }, { merge: true }).catch(() => {});
        } catch {
          // Gracefully continue if Firestore is offline
        }

        set({ user: account, firebaseUser: fbUser, isLoading: false, error: null });
      } else {
        const current = get().user;
        if (current?.uid === "demo-entrepreneur-id") {
          // Keep demo user active
          set({ isLoading: false });
        } else {
          set({ user: null, firebaseUser: null, isLoading: false, error: null });
        }
      }
    });

    return unsubscribe;
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const message = formatFirebaseAuthError(err);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (err: unknown) {
      const message = formatFirebaseAuthError(err);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const message = formatFirebaseAuthError(err);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signUpWithEmail: async (name: string, email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        // Create initial user document in Firestore database
        try {
          await setDoc(doc(db, "users", cred.user.uid), {
            uid: cred.user.uid,
            email,
            displayName: name,
            createdAt: new Date().toISOString(),
            role: "entrepreneur"
          }, { merge: true });
        } catch {
          // Gracefully proceed
        }
      }
    } catch (err: unknown) {
      const message = formatFirebaseAuthError(err);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signInAsDemoUser: () => {
    const demoAccount: UserAccount = {
      uid: "demo-entrepreneur-id",
      email: "entrepreneur.demo@niti-ai.gov.in",
      displayName: "Aditi Sharma",
      photoURL: null,
      phoneNumber: "+91 98765 43210",
      providerId: "demo",
      role: "entrepreneur",
      isOnboarded: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("niti_demo_session", JSON.stringify(demoAccount));
      localStorage.setItem("onboarded_demo-entrepreneur-id", "true");
    }

    set({ user: demoAccount, firebaseUser: null, isLoading: false, error: null });
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("niti_demo_session");
      }
      await firebaseSignOut(auth);
      set({ user: null, firebaseUser: null, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = formatFirebaseAuthError(err);
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  setOnboarded: (status: boolean) => {
    const current = get().user;
    if (current) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`onboarded_${current.uid}`, String(status));
      }
      set({ user: { ...current, isOnboarded: status } });
    }
  }
}));
