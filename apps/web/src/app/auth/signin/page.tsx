"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppleLogoIcon, GoogleLogoIcon } from "@/components/ui/BrandIcons";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { signInWithGoogle, signInWithApple, signInWithEmail, error, clearError } = useAuthStore();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithEmail(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-in was canceled or failed.");
    }
  };

  const handleAppleSignIn = async () => {
    clearError();
    try {
      await signInWithApple();
      toast.success("Signed in with Apple!");
      router.push("/dashboard");
    } catch {
      toast.error("Apple sign-in was canceled or failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative z-10 border border-white/10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight gradient-text">NITI AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Access your personalised government scheme dashboard</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Button type="button" variant="glass" fullWidth onClick={handleGoogleSignIn}
            className="border-white/10 hover:bg-white/10" leftIcon={<GoogleLogoIcon className="w-5 h-5" />}>
            Continue with Google
          </Button>
          <Button type="button" variant="glass" fullWidth onClick={handleAppleSignIn}
            className="border-white/10 hover:bg-white/10" leftIcon={<AppleLogoIcon className="w-5 h-5 text-white" />}>
            Continue with Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">or with email</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <Input label="Email address" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
          <Input label="Password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{error}</p>}
          <Button type="submit" variant="primary" fullWidth size="lg" loading={isSubmitting} className="mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
