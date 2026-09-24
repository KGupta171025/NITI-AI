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

export type SocialCategory = "general" | "obc" | "sc" | "st" | "minority" | "ews";

export interface EntrepreneurProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "transgender" | "other" | "prefer_not_to_say";
  education: string;
  occupation: string;
  annualIncome: number;
  areaType: AreaType;
  socialCategory?: SocialCategory | undefined;
  isDisability?: boolean | undefined;
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
  portalSource?: string;
  sector?: string;
  tags?: string[];
  isRealtimeVerified?: boolean;
  liveStatusText?: string;
}

export interface SchemeEligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  genderAllowed?: Array<"all" | "female" | "male" | "transgender">;
  socialCategoriesAllowed?: Array<SocialCategory | "all">;
  allowedBusinessStages?: Array<BusinessStage | "all">;
  allowedEnterpriseTypes?: Array<EnterpriseType | "all">;
  maxTurnover?: number;
  maxFundingSupported?: number;
  statesApplicable?: string[];
  areaTypeAllowed?: Array<AreaType | "all">;
}

export interface SchemeDetail extends SchemeSummary {
  description: string;
  benefitsSummary: string[];
  eligibilityCriteria: SchemeEligibilityCriteria;
  documentsRequired: string[];
  applicationProcess: string[];
  applicationUrl: string;
  implementingAgency: string;
  lastVerifiedAt: string;
}

/**
 * AI Chat & RAG Types
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  citations?: Array<{
    schemeId: string;
    schemeName: string;
    slug: string;
    excerpt: string;
  }>;
  suggestions?: string[];
}

export interface SchemeMatchResult {
  scheme: SchemeDetail;
  matchScore: number;
  isEligible: boolean;
  matchReasons: string[];
  disqualificationReasons: string[];
}

