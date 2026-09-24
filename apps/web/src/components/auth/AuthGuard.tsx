"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  requireOnboarded?: boolean;
}

export function AuthGuard({ children, requireOnboarded = false }: AuthGuardProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/signin");
      } else if (requireOnboarded && !user.isOnboarded) {
        router.replace("/onboarding");
      }
    }
  }, [user, isLoading, router, requireOnboarded]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
          <p className="text-sm text-slate-400">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireOnboarded && !user.isOnboarded) {
    return null;
  }

  return <>{children}</>;
}
