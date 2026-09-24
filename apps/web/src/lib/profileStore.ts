import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EntrepreneurProfile, BusinessLocation, SupportedLanguage, BusinessStage, EnterpriseType, AreaType } from "@niti-ai/types";

interface ProfileState {
  profile: Partial<EntrepreneurProfile>;
  step: number;
  totalSteps: number;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonal: (data: Partial<EntrepreneurProfile>) => void;
  updateBusiness: (data: Partial<EntrepreneurProfile>) => void;
  updateFunding: (data: Partial<EntrepreneurProfile>) => void;
  updateLocation: (location: BusinessLocation) => void;
  calculateCompletion: () => number;
  saveProfile: (userId: string) => EntrepreneurProfile;
  loadProfile: (userId: string) => Promise<void>;
  reset: () => void;
}

const initialProfile: Partial<EntrepreneurProfile> = {
  fullName: "",
  age: 28,
  gender: "prefer_not_to_say",
  education: "Graduate",
  occupation: "Self-Employed",
  annualIncome: 450000,
  areaType: "urban" as AreaType,
  socialCategory: "general",
  isDisability: false,
  preferredLanguage: "en" as SupportedLanguage,
  
  businessName: "",
  industry: "Manufacturing",
  sector: "Textiles & Handloom",
  businessStage: "starting" as BusinessStage,
  enterpriseType: "micro" as EnterpriseType,
  employeeCount: 4,
  annualTurnover: 800000,
  fundingRequired: 500000,
  fundingPurpose: "machinery",
  
  udyamNumber: "",
  gstin: "",
  startupIndiaRegistered: false,
  
  location: {
    latitude: 23.2599,
    longitude: 77.4126,
    state: "Madhya Pradesh",
    district: "Bhopal",
    city: "Bhopal",
    pincode: "462001",
    formattedAddress: "Bhopal, Madhya Pradesh, 462001"
  },
  
  profileCompletionPercentage: 0
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: initialProfile,
  step: 1,
  totalSteps: 5,

  setStep: (step: number) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, state.totalSteps) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  updatePersonal: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data }
    })),

  updateBusiness: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data }
    })),

  updateFunding: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data }
    })),

  updateLocation: (loc) =>
    set((state) => ({
      profile: { ...state.profile, location: loc }
    })),

  calculateCompletion: () => {
    const p = get().profile;
    let score = 0;
    if (p.fullName) score += 15;
    if (p.age && p.education) score += 15;
    if (p.businessName && p.industry) score += 20;
    if (p.fundingRequired && p.fundingPurpose) score += 20;
    if (p.location?.state && p.location?.district) score += 20;
    if (p.udyamNumber || p.gstin) score += 10;
    return Math.min(score, 100);
  },

  saveProfile: (userId: string) => {
    const completion = get().calculateCompletion();
    const finalProfile: EntrepreneurProfile = {
      ...(get().profile as EntrepreneurProfile),
      userId,
      profileCompletionPercentage: completion,
      updatedAt: new Date().toISOString()
    };

    // 1. Persist locally for instant offline retrieval
    if (typeof window !== "undefined") {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(finalProfile));
      localStorage.setItem(`onboarded_${userId}`, "true");
    }

    // 2. Persist to Cloud Firestore database
    try {
      const userDocRef = doc(db, "users", userId);
      setDoc(userDocRef, {
        profile: finalProfile,
        isOnboarded: true,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        console.warn("Firestore sync warning:", err);
      });
    } catch (err) {
      console.warn("Firestore unavailable:", err);
    }

    set({ profile: finalProfile });
    return finalProfile;
  },

  loadProfile: async (userId: string) => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`profile_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          set({ profile: parsed });
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Fetch latest from Cloud Firestore
    try {
      const userDocRef = doc(db, "users", userId);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.profile) {
          set({ profile: data.profile });
          if (typeof window !== "undefined") {
            localStorage.setItem(`profile_${userId}`, JSON.stringify(data.profile));
          }
        }
      }
    } catch {
      // Graceful fallback to cached state
    }
  },

  reset: () => set({ profile: initialProfile, step: 1 })
}));
