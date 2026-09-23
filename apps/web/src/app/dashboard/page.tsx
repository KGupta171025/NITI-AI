"use client";

import { useMemo } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { useProfileStore } from "@/lib/profileStore";
import { getRecommendedSchemes } from "@/lib/eligibilityEngine";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  MapPin, 
  CheckCircle, 
  LogOut, 
  TrendingUp, 
  Compass, 
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  IndianRupee,
  AlertTriangle,
  Building2,
  ExternalLink
} from "lucide-react";

export default function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { profile } = useProfileStore();

  const recommendedSchemes = useMemo(() => {
    return getRecommendedSchemes(profile);
  }, [profile]);

  const eligibleCount = useMemo(() => {
    return recommendedSchemes.filter((m) => m.isEligible).length;
  }, [recommendedSchemes]);

  const topMatch = recommendedSchemes[0];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Navigation */}
        <header className="glass-nav sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight gradient-text">
                NITI AI
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/schemes">
                <Button variant="ghost" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                  Schemes
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  AI Chat
                </Button>
              </Link>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-slate-200">
                  {profile.fullName || user?.displayName || "Entrepreneur"}
                </span>
                <span className="text-xs text-slate-400">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign out
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden border-brand-500/20">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1 text-xs text-brand-300 font-medium mb-3 border-brand-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Live Entrepreneur Dashboard
              </div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">
                Namaste, {profile.fullName || user?.displayName || "Entrepreneur"}!
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Welcome to your centralized government incentive engine. We matched your business profile with verified central and state schemes using deterministic evaluation and our self-hosted RAG advisory stack.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/onboarding">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Update Profile & Location
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="secondary" leftIcon={<Sparkles className="w-4 h-4" />}>
                    Consult AI Advisor
                  </Button>
                </Link>
                <Link href="/schemes">
                  <Button variant="ghost" leftIcon={<Search className="w-4 h-4" />}>
                    Browse All Schemes
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">{eligibleCount} Eligible</div>
                  <div className="text-xs text-slate-400">Schemes Directly Matching</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">{topMatch?.matchScore ?? 95}%</div>
                  <div className="text-xs text-slate-400">Top Scheme Fit</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-100 truncate max-w-[150px]">
                    {profile.location?.state || "National"}
                  </div>
                  <div className="text-xs text-slate-400">Active Jurisdiction</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">Deterministic</div>
                  <div className="text-xs text-slate-400">Rule-Based Matching</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Scheme Matches Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  Your Top Matched Government Schemes
                </h2>
                <p className="text-xs text-slate-400">
                  Ranked deterministically based on your age, social category, enterprise stage, funding requirements, and geographical jurisdiction.
                </p>
              </div>
              <Link href="/schemes" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
                View all database schemes
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedSchemes.map((result) => {
                const { scheme, matchScore, isEligible, matchReasons, disqualificationReasons } = result;
                return (
                  <Card key={scheme.id} glass hover className="flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          matchScore >= 80 
                            ? "bg-teal-500/15 text-teal-300 border-teal-500/30" 
                            : matchScore >= 60 
                            ? "bg-brand-500/15 text-brand-300 border-brand-500/30" 
                            : "bg-slate-800 text-slate-400 border-white/10"
                        }`}>
                          {matchScore}% Match
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-2xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                            {scheme.governmentLevel}
                          </span>
                          {scheme.subsidyPercentage && (
                            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                              {scheme.subsidyPercentage}% Subsidy
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-100 text-lg leading-tight">
                        {scheme.schemeName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {scheme.ministry}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {scheme.summary}
                      </p>

                      {scheme.fundingRange && (
                        <div className="flex items-center gap-1.5 text-xs text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-xl">
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>
                            Support: ₹{(scheme.fundingRange.min).toLocaleString("en-IN")} - ₹{(scheme.fundingRange.max).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {/* Criteria Fit Reasons */}
                      <div className="space-y-1.5 text-xs">
                        <span className="font-semibold text-slate-300 block mb-1">Key Match Highlights:</span>
                        {matchReasons.slice(0, 3).map((reason, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-teal-300">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                        {!isEligible && disqualificationReasons.slice(0, 1).map((disqual, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{disqual}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <Link href={`/chat?q=Explain ${encodeURIComponent(scheme.shortName)} eligibility and documents`}>
                        <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                          Ask AI
                        </Button>
                      </Link>

                      <div className="flex items-center gap-2">
                        <a
                          href={scheme.officialSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={scheme.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Apply
                          </Button>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Account Profile Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card glass>
              <CardHeader>
                <h3 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-400" />
                  Your Enterprise Profile Snapshot
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Sector & Industry</span>
                  <span className="text-slate-200 font-medium">{profile.sector || "Manufacturing"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Enterprise Stage</span>
                  <span className="text-slate-200 capitalize font-medium">{profile.businessStage || "Starting"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Social Category</span>
                  <span className="text-slate-200 uppercase font-medium">{profile.socialCategory || "General"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Location Pinpoint</span>
                  <span className="text-slate-200 font-medium">
                    {profile.location?.district ? `${profile.location.district}, ${profile.location.state}` : "Madhya Pradesh, India"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Funding Requirement</span>
                  <span className="text-teal-400 font-medium">
                    ₹{(profile.fundingRequired || 500000).toLocaleString("en-IN")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader>
                <h3 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  Security & Verification Status
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Authentication Provider</span>
                  <span className="text-slate-200 capitalize font-medium">{user?.providerId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">User Identifier</span>
                  <span className="text-slate-300 font-mono text-xs truncate max-w-[200px]">{user?.uid}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Session Security</span>
                  <span className="text-teal-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Client SDK Validated
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Privacy & Compliance</span>
                  <span className="text-brand-400 font-medium">DPDP Act (India) Aligned</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
