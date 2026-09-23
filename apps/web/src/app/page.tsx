"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Shield, Zap, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-6 group hover:border-brand-500/30 transition-colors duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4 group-hover:bg-brand-500/25 transition-colors duration-300">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
      <h3 className="text-slate-100 font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Statistics Row ───────────────────────────────────────────────────────────
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold gradient-text">{value}</div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden">

      {/* ─── Background glows ──── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      {/* ─── Navigation ──────────────────────────────────────────────────── */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight gradient-text">
              NITI AI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link href="#features" className="hover:text-slate-100 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-slate-100 transition-colors">How it works</Link>
            <Link href="#schemes" className="hover:text-slate-100 transition-colors">Schemes</Link>
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-slate-200 hover:text-white bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10"
                >
                  <User className="w-4 h-4 text-brand-400" />
                  <span>{user.displayName || "Dashboard"}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:block text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-glow text-sm font-medium bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-brand-300 font-medium mb-8 border-brand-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            AI-Powered Government Scheme Discovery
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-50 leading-[1.1] tracking-tight mb-6"
          >
            Find Government Schemes
            <br />
            <span className="gradient-text">Built for Your Business</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed mb-10"
          >
            NITI AI matches your entrepreneur profile to relevant central and state government schemes — in English, Hindi, or Hinglish — powered entirely by self-hosted AI.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/auth/signup"
              className="btn-glow flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow-md text-base"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-8 py-3.5 rounded-xl transition-all duration-200 text-base"
            >
              See how it works
            </Link>
          </motion.div>

          {/* Multilingual hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-slate-500 text-sm font-hindi"
          >
            अंग्रेजी, हिंदी, या Hinglish में पूछें — हम समझते हैं।
          </motion.p>
        </section>

        {/* ─── Stats ─────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <StatItem value="1,200+" label="Active Schemes" />
            <StatItem value="36"     label="States & UTs" />
            <StatItem value="3"      label="Languages" />
            <StatItem value="100%"   label="Self-Hosted AI" />
          </div>
        </section>

        {/* ─── Features ──────────────────────────────────────────────────── */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              Everything you need to find the{" "}
              <span className="gradient-text">right scheme</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From profile creation to personalized AI recommendations — all in one platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Sparkles}
              title="AI Scheme Matching"
              desc="Semantic matching against 1,200+ verified schemes based on your business profile, location, and stage."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Eligibility Engine"
              desc="Deterministic rule-based eligibility checking. Know exactly which criteria you meet and which you don't."
              delay={0.08}
            />
            <FeatureCard
              icon={Globe}
              title="Multilingual Assistant"
              desc="Ask questions in English, Hindi, or Hinglish. The AI understands and responds in the language you use."
              delay={0.16}
            />
            <FeatureCard
              icon={Zap}
              title="Instant Recommendations"
              desc="Personalised scheme ranking with explainable AI — you always see why a scheme was recommended."
              delay={0.24}
            />
            <FeatureCard
              icon={Shield}
              title="100% Self-Hosted AI"
              desc="No OpenAI, no Gemini API. LLM inference, embeddings, and RAG all run on open-source local models."
              delay={0.32}
            />
            <FeatureCard
              icon={Globe}
              title="Scheme Versioning"
              desc="Government schemes change. NITI AI tracks every change with full version history and change detection."
              delay={0.40}
            />
          </div>
        </section>

        {/* ─── How it works ──────────────────────────────────────────────── */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              How <span className="gradient-text">NITI AI</span> works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three simple steps to discover schemes tailored exactly to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Tell us about yourself and your business — industry, location, stage, and funding needs.",
              },
              {
                step: "02",
                title: "AI analyses eligibility",
                desc: "Our rule engine and local LLM analyse your profile against thousands of eligibility criteria.",
              },
              {
                step: "03",
                title: "Get matched schemes",
                desc: "Receive a ranked list of schemes with explanations, documents required, and application links.",
              },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-brand-400 font-bold text-xl mb-4">
                  {step}
                </div>
                <h3 className="text-slate-100 font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── CTA Banner ────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="glass-card rounded-3xl p-10 border-brand-500/15">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              Ready to discover your{" "}
              <span className="gradient-text">perfect scheme?</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Create your free entrepreneur profile and get AI-powered recommendations in minutes.
            </p>
            <Link
              href="/auth/signup"
              className="btn-glow inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 shadow-glow-sm hover:shadow-glow-md text-base"
            >
              Get started — it&apos;s free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-10 text-center text-slate-500 text-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NITI AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/docs" className="hover:text-slate-300 transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
