"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { useProfileStore } from "@/lib/profileStore";
import { getRecommendedSchemes } from "@/lib/eligibilityEngine";
import { LocationPicker } from "@/components/onboarding/LocationPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { 
  Sparkles, 
  User, 
  Building2, 
  IndianRupee, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Search,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { EntrepreneurProfile, SocialCategory, BusinessStage, EnterpriseType, AreaType, SupportedLanguage } from "@niti-ai/types";

export default function UserProfilePage() {
  const { user } = useAuthStore();
  const { 
    profile, 
    updatePersonal, 
    updateBusiness, 
    updateFunding, 
    updateLocation, 
    calculateCompletion, 
    saveProfile 
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState<"personal" | "enterprise" | "funding" | "location">("personal");
  const [isSaving, setIsSaving] = useState(false);

  const completion = calculateCompletion();
  const recommendedSchemes = getRecommendedSchemes(profile);
  const eligibleCount = recommendedSchemes.filter((r) => r.isEligible).length;

  const handleSaveAll = () => {
    if (!user) return;
    setIsSaving(true);
    try {
      saveProfile(user.uid);
      toast.success("Profile successfully saved and synchronized to Cloud Firestore!");
    } catch {
      toast.error("Failed to save profile. Saved locally as fallback.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Navigation Bar */}
        <header className="glass-nav sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-slate-400 hover:text-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight gradient-text">
                  NITI AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/schemes">
                <Button variant="ghost" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                  Schemes
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  AI Advisor
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAll}
                loading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Profile
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Profile Header Hero */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border-brand-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-teal-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-2xl shadow-glow-sm">
                  {(profile.fullName || user?.displayName || "E")[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-50">
                      {profile.fullName || user?.displayName || "Entrepreneur Profile"}
                    </h1>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      Verified Account
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {user?.email} • {profile.businessName || "Enterprise Registration in Progress"}
                  </p>
                </div>
              </div>

              {/* Profile Completion Meter */}
              <div className="flex items-center gap-4 bg-slate-900/80 border border-white/10 rounded-2xl p-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Profile Readiness</div>
                  <div className="text-2xl font-bold text-teal-400">{completion}%</div>
                  <div className="text-[10px] text-slate-400">{eligibleCount} Eligible Schemes</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-teal-500/30 border-t-teal-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                </div>
              </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
              {[
                { id: "personal", label: "Personal Details", icon: User },
                { id: "enterprise", label: "Business Metadata", icon: Building2 },
                { id: "funding", label: "Funding & Capital", icon: IndianRupee },
                { id: "location", label: "Geographic Location", icon: MapPin },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? "bg-brand-500 text-white shadow-glow-sm" 
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Tabs Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Tab 1: Personal */}
              {activeTab === "personal" && (
                <Card glass className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">Personal & Social Background</h3>
                      <p className="text-xs text-slate-400">Used for affirmative subsidies (Women, SC/ST/OBC, Rural quotas)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Legal Name"
                      value={profile.fullName || ""}
                      onChange={(e) => updatePersonal({ fullName: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                    />
                    <Input
                      label="Age"
                      type="number"
                      value={profile.age || 28}
                      onChange={(e) => updatePersonal({ age: Number(e.target.value) })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Gender</label>
                      <select
                        value={profile.gender || "prefer_not_to_say"}
                        onChange={(e) => updatePersonal({ gender: e.target.value as EntrepreneurProfile["gender"] })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="female">Female (Qualifies for Stand-Up India & 35% subsidies)</option>
                        <option value="male">Male</option>
                        <option value="transgender">Transgender</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Social Category</label>
                      <select
                        value={profile.socialCategory || "general"}
                        onChange={(e) => updatePersonal({ socialCategory: e.target.value as SocialCategory })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="general">General</option>
                        <option value="obc">OBC (Other Backward Classes)</option>
                        <option value="sc">SC (Scheduled Caste - Special Subsidy)</option>
                        <option value="st">ST (Scheduled Tribe - Special Subsidy)</option>
                        <option value="minority">Minority Community</option>
                        <option value="ews">EWS (Economically Weaker Section)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Highest Educational Qualification"
                      value={profile.education || ""}
                      onChange={(e) => updatePersonal({ education: e.target.value })}
                      placeholder="e.g. Graduate / Diploma / ITI"
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Area Type</label>
                      <select
                        value={profile.areaType || "urban"}
                        onChange={(e) => updatePersonal({ areaType: e.target.value as AreaType })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="urban">Urban</option>
                        <option value="rural">Rural (Eligible for highest 35% PMEGP grant)</option>
                        <option value="semi-urban">Semi-Urban</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Annual Household Income (₹)"
                      type="number"
                      value={profile.annualIncome || 450000}
                      onChange={(e) => updatePersonal({ annualIncome: Number(e.target.value) })}
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Preferred AI Language</label>
                      <select
                        value={profile.preferredLanguage || "en"}
                        onChange={(e) => updatePersonal({ preferredLanguage: e.target.value as SupportedLanguage })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="hinglish">Hinglish (Hindi in Roman script)</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {/* Tab 2: Enterprise */}
              {activeTab === "enterprise" && (
                <Card glass className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">Business & Enterprise Profile</h3>
                      <p className="text-xs text-slate-400">Classifies MSME category and industry-specific grants</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business / Enterprise Name"
                      value={profile.businessName || ""}
                      onChange={(e) => updateBusiness({ businessName: e.target.value })}
                      placeholder="e.g. Shanti Agro Foods Pvt Ltd"
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Business Stage</label>
                      <select
                        value={profile.businessStage || "starting"}
                        onChange={(e) => updateBusiness({ businessStage: e.target.value as BusinessStage })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="idea">Idea Stage (Looking for seed grants)</option>
                        <option value="starting">Starting New Unit (0 - 1 year)</option>
                        <option value="existing">Existing Established Business</option>
                        <option value="expansion">Scale-Up / Modernization</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Industry Category"
                      value={profile.industry || ""}
                      onChange={(e) => updateBusiness({ industry: e.target.value })}
                      placeholder="e.g. Manufacturing, Agriculture, IT, Handloom"
                    />
                    <Input
                      label="Sector Specialization"
                      value={profile.sector || ""}
                      onChange={(e) => updateBusiness({ sector: e.target.value })}
                      placeholder="e.g. Food Processing, Solar, Textiles"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Enterprise Type</label>
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
                      label="Annual Turnover (₹)"
                      type="number"
                      value={profile.annualTurnover || 800000}
                      onChange={(e) => updateBusiness({ annualTurnover: Number(e.target.value) })}
                    />
                    <Input
                      label="Employees Count"
                      type="number"
                      value={profile.employeeCount || 4}
                      onChange={(e) => updateBusiness({ employeeCount: Number(e.target.value) })}
                    />
                  </div>
                </Card>
              )}

              {/* Tab 3: Funding */}
              {activeTab === "funding" && (
                <Card glass className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">Financing Requirements & Compliance</h3>
                      <p className="text-xs text-slate-400">Matches project cost limits with government loan & grant caps</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Estimated Capital / Loan Required (₹)"
                      type="number"
                      value={profile.fundingRequired || 500000}
                      onChange={(e) => updateFunding({ fundingRequired: Number(e.target.value) })}
                    />
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-1.5">Primary Purpose of Capital</label>
                      <select
                        value={profile.fundingPurpose || "machinery"}
                        onChange={(e) => updateFunding({ fundingPurpose: e.target.value as EntrepreneurProfile["fundingPurpose"] })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="machinery">Machinery & Plant Equipment</option>
                        <option value="working_capital">Working Capital & Raw Materials</option>
                        <option value="expansion">New Factory / Unit Expansion</option>
                        <option value="technology">Clean Tech / Automation (ZED)</option>
                        <option value="marketing">Export & Branding Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Government Registrations</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Udyam Registration Number"
                        value={profile.udyamNumber || ""}
                        onChange={(e) => updateFunding({ udyamNumber: e.target.value })}
                        placeholder="UDYAM-XX-00-0000000"
                      />
                      <Input
                        label="GSTIN Number"
                        value={profile.gstin || ""}
                        onChange={(e) => updateFunding({ gstin: e.target.value })}
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Tab 4: Location */}
              {activeTab === "location" && (
                <Card glass className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">Business Location & Geo-Pinpoint</h3>
                      <p className="text-xs text-slate-400">Pins your enterprise location to match state and district schemes</p>
                    </div>
                  </div>

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
                </Card>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSaveAll}
                  loading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile to Cloud
                </Button>
              </div>
            </div>

            {/* Sidebar Overview */}
            <div className="space-y-6">
              <Card glass className="p-5">
                <CardHeader className="p-0 pb-3">
                  <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    Top Matched Schemes
                  </h3>
                </CardHeader>
                <CardContent className="p-0 space-y-3 pt-2 text-xs">
                  {recommendedSchemes.slice(0, 4).map((r) => (
                    <div key={r.scheme.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{r.scheme.shortName}</span>
                        <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                          {r.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-slate-400 line-clamp-1">{r.scheme.summary}</p>
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-brand-300">
                          {r.scheme.subsidyPercentage ? `${r.scheme.subsidyPercentage}% Subsidy` : "Collateral-Free"}
                        </span>
                        <Link href={`/chat?q=Tell me more about ${encodeURIComponent(r.scheme.shortName)}`} className="text-slate-300 hover:text-white flex items-center gap-1">
                          Ask AI <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Link href="/schemes">
                      <Button variant="ghost" fullWidth size="sm">
                        View All {recommendedSchemes.length} Schemes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card glass className="p-5 text-xs text-slate-400 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  DPDP Act (India) Data Security
                </div>
                <p className="leading-relaxed">
                  Your business metadata is strictly confidential and used solely for deterministic eligibility evaluation against verified Central and State Government schemes.
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
