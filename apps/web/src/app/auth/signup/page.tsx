"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppleLogoIcon, GoogleLogoIcon } from "@/components/ui/BrandIcons";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { user, signInWithGoogle, signInWithApple, signUpWithEmail, signInAsDemoUser, error, clearError } = useAuthStore();

  // If user is already logged in, redirect directly to dashboard or onboarding
  useEffect(() => {
    if (user) {
      router.replace(user.isOnboarded ? "/dashboard" : "/onboarding");
    }
  }, [user, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all required fields"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters long"); return; }

    setIsSubmitting(true);
    clearError();
    try {
      await signUpWithEmail(name, email, password);
      toast.success("Account created successfully!");
      router.replace("/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account.";
      if (msg.toLowerCase().includes("already") || msg.includes("in-use")) {
        toast.info("An account with this email already exists. Redirecting to Sign In...");
        setTimeout(() => router.replace(`/auth/signin?email=${encodeURIComponent(email)}`), 1200);
        return;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    clearError();
    try {
      await signInWithGoogle();
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.isOnboarded) {
        toast.success("Welcome back! Existing profile loaded.");
        router.replace("/dashboard");
      } else {
        toast.success("Signed in with Google!");
        router.replace("/onboarding");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in was canceled or failed.";
      toast.error(msg);
    }
  };

  const handleAppleSignUp = async () => {
    clearError();
    try {
      await signInWithApple();
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.isOnboarded) {
        toast.success("Welcome back! Existing profile loaded.");
        router.replace("/dashboard");
      } else {
        toast.success("Signed in with Apple!");
        router.replace("/onboarding");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Apple sign-in was canceled or failed.";
      toast.error(msg);
    }
  };

  const handleDemoSignUp = () => {
    signInAsDemoUser();
    toast.success("Welcome, Aditi Sharma! Demo entrepreneur profile loaded.");
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight gradient-text">NITI AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Empower your enterprise with AI government scheme intelligence</p>
        </div>

        {/* 1-Click Instant Demo Login for Hackathon / Evaluators */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-brand-500/15 via-teal-500/10 to-brand-500/15 border border-brand-500/30">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-brand-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Instant Evaluator Access
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Skip Signup
            </span>
          </div>
          <Button
            type="button"
            variant="primary"
            fullWidth
            size="sm"
            onClick={handleDemoSignUp}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Enter with Pre-configured Demo Profile
          </Button>
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          <Button type="button" variant="glass" fullWidth onClick={handleGoogleSignUp}
            className="border-white/10 hover:bg-white/10 text-xs py-2.5" leftIcon={<GoogleLogoIcon className="w-4 h-4" />}>
            Continue with Google
          </Button>
          <Button type="button" variant="glass" fullWidth onClick={handleAppleSignUp}
            className="border-white/10 hover:bg-white/10 text-xs py-2.5" leftIcon={<AppleLogoIcon className="w-4 h-4 text-white" />}>
            Continue with Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">or with email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <Input label="Full Name" type="text" placeholder="Aarav Sharma"
            value={name} onChange={(e) => setName(e.target.value)} leftIcon={<User className="w-4 h-4" />} required />
          <Input label="Email address" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
          <Input label="Password" type="password" placeholder="At least 6 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />
          <Input label="Confirm Password" type="password" placeholder="Re-enter password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />

          {error && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Firebase Notice:</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <Button type="submit" variant="secondary" fullWidth size="lg" loading={isSubmitting} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-brand-400 hover:text-brand-300 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
