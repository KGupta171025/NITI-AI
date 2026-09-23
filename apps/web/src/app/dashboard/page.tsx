"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  MapPin, 
  CheckCircle, 
  LogOut, 
  TrendingUp, 
  FileText, 
  Compass, 
  ArrowRight 
} from "lucide-react";

export default function DashboardPage() {
  const { user, signOut } = useAuthStore();

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

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-slate-200">
                  {user?.displayName || "Entrepreneur"}
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
                Phase 2 Authenticated Session Active
              </div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">
                Namaste, {user?.displayName || "Entrepreneur"}!
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Your account is authenticated via Firebase. You can now establish your complete entrepreneur profile, map your business location, and unlock personalized AI recommendations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/onboarding">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Complete Business Profile
                  </Button>
                </Link>
                <Link href="/schemes">
                  <Button variant="secondary" leftIcon={<Search className="w-4 h-4" />}>
                    Explore Schemes
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">1,240+</div>
                  <div className="text-xs text-slate-400">Live Schemes</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">36 States</div>
                  <div className="text-xs text-slate-400">Geographic Coverage</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">Deterministic</div>
                  <div className="text-xs text-slate-400">Rule Eligibility</div>
                </div>
              </div>
            </Card>

            <Card glass className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-100">Self-Hosted</div>
                  <div className="text-xs text-slate-400">AI Privacy Stack</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Account Profile Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card glass>
              <CardHeader>
                <h3 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-400" />
                  Account Security & Session
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Authentication Provider</span>
                  <span className="text-slate-200 capitalize font-medium">{user?.providerId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">User Identifier</span>
                  <span className="text-slate-300 font-mono text-xs">{user?.uid}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Onboarding Status</span>
                  <span className={user?.isOnboarded ? "text-teal-400 font-medium" : "text-amber-400 font-medium"}>
                    {user?.isOnboarded ? "Completed" : "Pending Profile Setup"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Role</span>
                  <span className="text-brand-400 font-medium capitalize">{user?.role}</span>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader>
                <h3 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Next Step: Entrepreneur Onboarding
                </h3>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-300">
                <p>
                  To receive targeted scheme recommendations, complete the multi-step onboarding wizard:
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    Personal & Social Profile (Age, Education, Category)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    Business Metadata (Sector, Stage, Turnover, Funding Purpose)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    Interactive Map Pinpoint (State, District, Coordinates)
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/onboarding">
                    <Button variant="primary" fullWidth>
                      Start Onboarding Wizard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
