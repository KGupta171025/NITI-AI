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
import { auth, googleProvider, appleProvider } from "@/lib/firebase";
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
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Read onboarding flag from localStorage if available
        const localOnboarded = typeof window !== "undefined" 
          ? localStorage.getItem(`onboarded_${fbUser.uid}`) === "true" 
          : false;

        const account: UserAccount = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          phoneNumber: fbUser.phoneNumber,
          providerId: fbUser.providerData[0]?.providerId || "password",
          role: "entrepreneur",
          isOnboarded: localOnboarded,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: fbUser.metadata.lastSignInTime || new Date().toISOString(),
        };

        set({ user: account, firebaseUser: fbUser, isLoading: false, error: null });
      } else {
        set({ user: null, firebaseUser: null, isLoading: false, error: null });
      }
    });

    return unsubscribe;
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Google";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Apple";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signUpWithEmail: async (name: string, email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register account";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await firebaseSignOut(auth);
      set({ user: null, firebaseUser: null, isLoading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error signing out";
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
