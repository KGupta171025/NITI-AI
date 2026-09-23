/**
 * Core User & Authentication Types
 */
export type UserRole = "entrepreneur" | "admin" | "officer";

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: "google.com" | "apple.com" | "password" | string;
  role: UserRole;
  isOnboarded: boolean;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Entrepreneur & Business Profile
 */
export type BusinessStage = "idea" | "starting" | "existing" | "expansion";
export type EnterpriseType = "micro" | "small" | "medium";
export type AreaType = "rural" | "urban" | "semi-urban";
export type SupportedLanguage = "en" | "hi" | "hinglish";

export interface BusinessLocation {
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  city: string;
  pincode: string;
  formattedAddress: string;
}

export interface EntrepreneurProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "transgender" | "other" | "prefer_not_to_say";
  education: string;
  occupation: string;
  annualIncome: number;
  areaType: AreaType;
  socialCategory?: "general" | "obc" | "sc" | "st" | "minority" | "ews";
  isDisability?: boolean;
  preferredLanguage: SupportedLanguage;
  
  // Business fields
  businessName: string;
  industry: string;
  sector: string;
  businessStage: BusinessStage;
  enterpriseType: EnterpriseType;
  employeeCount: number;
  annualTurnover: number;
  fundingRequired: number;
  fundingPurpose: "machinery" | "working_capital" | "expansion" | "marketing" | "technology" | "other";
  
  // Registration
  udyamNumber?: string;
  gstin?: string;
  startupIndiaRegistered?: boolean;
  
  // Location
  location: BusinessLocation;
  
  profileCompletionPercentage: number;
  updatedAt: string;
}

/**
 * Scheme Models
 */
export type GovernmentLevel = "central" | "state" | "ut";
export type SchemeStatus = "upcoming" | "active" | "suspended" | "closed";

export interface SchemeSummary {
  id: string;
  schemeName: string;
  shortName: string;
  slug: string;
  summary: string;
  governmentLevel: GovernmentLevel;
  ministry: string;
  department: string;
  schemeStatus: SchemeStatus;
  fundingRange?: { min: number; max: number };
  subsidyPercentage?: number;
  launchDate?: string;
  closingDate?: string;
  officialSourceUrl: string;
  version: number;
}
