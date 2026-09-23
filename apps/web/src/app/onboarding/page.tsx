"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/lib/profileStore";
import { useAuthStore } from "@/lib/authStore";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LocationPicker } from "@/components/onboarding/LocationPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  User, 
  Building2, 
  IndianRupee, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { EntrepreneurProfile, SocialCategory, BusinessStage, EnterpriseType, AreaType, SupportedLanguage } from "@niti-ai/types";

const STEPS = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Enterprise", icon: Building2 },
  { id: 3, title: "Capital", icon: IndianRupee },
  { id: 4, title: "Location", icon: MapPin },
  { id: 5, title: "Review", icon: CheckCircle2 }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setOnboarded } = useAuthStore();
  const { 
    step, 
    totalSteps, 
    nextStep, 
    prevStep, 
    profile, 
    updatePersonal, 
    updateBusiness, 
    updateFunding, 
    updateLocation,
    calculateCompletion,
    saveProfile 
  } = useProfileStore();

  const handleFinish = () => {
    if (!user) {
      toast.error("Please log in to save your profile");
      return;
    }

    saveProfile(user.uid);
    setOnboarded(true);
    toast.success("Entrepreneur profile established successfully!");
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[120px]" />
        </div>

        <div className="w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-10 relative z-10 border border-white/10 shadow-glass-lg">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Entrepreneur Intelligence Setup
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Setup Your Business Profile
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Step {step} of {totalSteps}</span>
              <div className="text-lg font-bold text-teal-400">{calculateCompletion()}% Complete</div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isPast = s.id < step;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-brand-500 text-white shadow-glow-sm"
                        : isPast
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        : "bg-white/5 text-slate-500 border border-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-2xs sm:text-xs font-medium ${
                      isActive ? "text-slate-100" : isPast ? "text-teal-300" : "text-slate-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Step Content */}
          <div className="min-h-[380px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Profile */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-slate-200">
                    Personal & Demographic Profile
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Legal Name"
                      placeholder="e.g. Ramesh Patel"
                      value={profile.fullName || ""}
                      onChange={(e) => updatePersonal({ fullName: e.target.value })}
                      required
                    />
                    <Input
                      label="Age"
                      type="number"
                      value={profile.age || 28}
                      onChange={(e) => updatePersonal({ age: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Gender (Relevant for specific women entrepreneur schemes)
                      </label>
                      <select
                        value={profile.gender || "prefer_not_to_say"}
                        onChange={(e) => updatePersonal({ gender: e.target.value as EntrepreneurProfile["gender"] })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="transgender">Transgender</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Area Type
                      </label>
                      <select
                        value={profile.areaType || "urban"}
                        onChange={(e) => updatePersonal({ areaType: e.target.value as AreaType })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="urban">Urban</option>
                        <option value="rural">Rural (eligible for PMEGP rural subsidy)</option>
                        <option value="semi-urban">Semi-Urban</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Highest Education"
                      placeholder="e.g. Graduate / Diploma / 10th"
                      value={profile.education || ""}
                      onChange={(e) => updatePersonal({ education: e.target.value })}
                    />
                    <Input
                      label="Annual Household Income (₹)"
                      type="number"
                      value={profile.annualIncome || 450000}
                      onChange={(e) => updatePersonal({ annualIncome: Number(e.target.value) })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Social Category (Optional – used for affirmative schemes)
                      </label>
                      <select
                        value={profile.socialCategory || "general"}
                        onChange={(e) => updatePersonal({ socialCategory: e.target.value as SocialCategory })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                        <option value="minority">Minority</option>
                        <option value="ews">EWS</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Preferred Language for AI Assistant
                      </label>
                      <select
                        value={profile.preferredLanguage || "en"}
                        onChange={(e) => updatePersonal({ preferredLanguage: e.target.value as SupportedLanguage })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="hinglish">Hinglish (Hindi in English letters)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Enterprise Metadata */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-slate-200">
                    Business Profile & Classification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business / Enterprise Name"
                      placeholder="e.g. Apex Textiles Pvt Ltd"
                      value={profile.businessName || ""}
                      onChange={(e) => updateBusiness({ businessName: e.target.value })}
                      required
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Business Stage
                      </label>
                      <select
                        value={profile.businessStage || "starting"}
                        onChange={(e) => updateBusiness({ businessStage: e.target.value as BusinessStage })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="idea">Idea Stage</option>
                        <option value="starting">Starting New Business (0-1 year)</option>
                        <option value="existing">Existing Established Business</option>
                        <option value="expansion">Scale-Up / Expansion</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Industry Category"
                      placeholder="e.g. Manufacturing, Agriculture, IT, Handloom"
                      value={profile.industry || ""}
                      onChange={(e) => updateBusiness({ industry: e.target.value })}
                      required
                    />
                    <Input
                      label="Sector Specialization"
                      placeholder="e.g. Food Processing, Solar, Handicrafts"
                      value={profile.sector || ""}
                      onChange={(e) => updateBusiness({ sector: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Enterprise Type
                      </label>
                      <select
                        value={profile.enterpriseType || "micro"}
                        onChange={(e) => updateBusiness({ enterpriseType: e.target.value as EnterpriseType })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="micro">Micro (&lt; ₹1 Cr investment)</option>
                        <option value="small">Small (&lt; ₹10 Cr)</option>
                        <option value="medium">Medium (&lt; ₹50 Cr)</option>
                      </select>
                    </div>
                    <Input
                      label="Number of Employees"
                      type="number"
                      value={profile.employeeCount || 4}
                      onChange={(e) => updateBusiness({ employeeCount: Number(e.target.value) })}
                    />
                    <Input
                      label="Annual Turnover (₹)"
                      type="number"
                      value={profile.annualTurnover || 800000}
                      onChange={(e) => updateBusiness({ annualTurnover: Number(e.target.value) })}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Capital & Funding Requirement */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-slate-200">
                    Capital, Loan & Subsidy Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Funding Amount Required (₹)"
                      type="number"
                      placeholder="e.g. 500000"
                      value={profile.fundingRequired || 500000}
                      onChange={(e) => updateFunding({ fundingRequired: Number(e.target.value) })}
                      required
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">
                        Primary Purpose of Funds
                      </label>
                      <select
                        value={profile.fundingPurpose || "machinery"}
                        onChange={(e) => updateFunding({ fundingPurpose: e.target.value as EntrepreneurProfile["fundingPurpose"] })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="machinery">Equipment & Machinery Purchase</option>
                        <option value="working_capital">Working Capital & Inventory</option>
                        <option value="expansion">Business Expansion / New Unit</option>
                        <option value="technology">Technology & Digital Adoption</option>
                        <option value="marketing">Marketing & Export Development</option>
                        <option value="other">General Operational Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">
                      Registrations & Compliances (Helps qualify for formal credit guarantee)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Udyam Registration Number (Optional)"
                        placeholder="UDYAM-XX-00-0000000"
                        value={profile.udyamNumber || ""}
                        onChange={(e) => updateFunding({ udyamNumber: e.target.value })}
                      />
                      <Input
                        label="GSTIN Number (Optional)"
                        placeholder="22AAAAA0000A1Z5"
                        value={profile.gstin || ""}
                        onChange={(e) => updateFunding({ gstin: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Business Location */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-slate-200">
                    Business Location Pinpoint (State & District Matching)
                  </h3>
                  <LocationPicker
                    value={profile.location || {
                      latitude: 23.2599,
                      longitude: 77.4126,
                      state: "Madhya Pradesh",
                      district: "Bhopal",
                      city: "Bhopal",
                      pincode: "462001",
                      formattedAddress: "Bhopal, Madhya Pradesh - 462001"
                    }}
                    onChange={(loc) => updateLocation(loc)}
                  />
                </motion.div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-5 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-teal-400 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-100">
                        Profile Readiness: {calculateCompletion()}%
                      </h4>
                      <p className="text-xs text-slate-300">
                        Your profile contains sufficient parameters to perform deterministic eligibility evaluations against all central and state government schemes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-semibold text-brand-400 uppercase">Enterprise</span>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-slate-200 font-medium">{profile.businessName || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stage:</span>
                        <span className="text-slate-200 capitalize">{profile.businessStage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sector:</span>
                        <span className="text-slate-200">{profile.sector}</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-semibold text-teal-400 uppercase">Funding & Location</span>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Required:</span>
                        <span className="text-slate-200 font-medium">₹{(profile.fundingRequired || 0).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Purpose:</span>
                        <span className="text-slate-200 capitalize">{profile.fundingPurpose}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-slate-200">{profile.location?.district}, {profile.location?.state}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Activate Entrepreneur Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
