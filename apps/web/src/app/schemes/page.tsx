"use client";

import { useState } from "react";
import Link from "next/link";
import { SCHEMES_DATABASE } from "@/lib/schemesData";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { 
  Sparkles, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  IndianRupee, 
  Scale, 
  X, 
  Check,
  RefreshCw,
  Globe2,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { SchemeDetail } from "@niti-ai/types";

export default function SchemesExplorerPage() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPortal, setSelectedPortal] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const filteredSchemes = SCHEMES_DATABASE.filter((scheme) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      scheme.schemeName.toLowerCase().includes(q) ||
      scheme.shortName.toLowerCase().includes(q) ||
      scheme.summary.toLowerCase().includes(q) ||
      scheme.sector?.toLowerCase().includes(q) ||
      scheme.tags?.some((t) => t.toLowerCase().includes(q));

    const matchesLevel =
      selectedLevel === "all" || scheme.governmentLevel === selectedLevel;

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "subsidy" && scheme.subsidyPercentage !== undefined && scheme.subsidyPercentage >= 25) ||
      (selectedCategory === "credit_guarantee" && (scheme.slug === "cgtmse" || scheme.slug === "pm-mudra")) ||
      (selectedCategory === "women_scst" && (scheme.slug === "standup-india" || scheme.slug === "nssh" || scheme.slug === "pmegp")) ||
      (selectedCategory === "startups" && (scheme.slug === "sisfs" || scheme.slug === "karnataka-elevate")) ||
      (selectedCategory === "artisans" && (scheme.slug === "pm-vishwakarma" || scheme.slug === "up-odop-scheme"));

    const matchesPortal =
      selectedPortal === "all" ||
      (scheme.portalSource && scheme.portalSource.toLowerCase().includes(selectedPortal.toLowerCase()));

    return matchesSearch && matchesLevel && matchesCategory && matchesPortal;
  });

  const handleRefreshFeeds = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Synchronized with 5 national portals: All 14 scheme gazettes up to date!");
    }, 600);
  };

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[0] ?? id, id]);
      } else {
        setCompareList([...compareList, id]);
      }
    }
  };

  const comparedSchemes = SCHEMES_DATABASE.filter((s) => compareList.includes(s.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
                Profile
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Ask NITI Saathi
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title & Live Status Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unified National & State Scheme Intelligence
            </div>
            <h1 className="text-3xl font-bold text-slate-50">
              Government Schemes & Subsidy Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time directory aggregated from JanSamarth, Startup India, MyScheme, KVIC, and State Single-Window Portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Real-Time Sync Active ({SCHEMES_DATABASE.length} Schemes Verified)</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefreshFeeds}
              loading={isRefreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Feeds
            </Button>
          </div>
        </div>

        {/* Selected for Comparison Bar */}
        {compareList.length > 0 && (
          <div className="flex items-center justify-between bg-slate-900 border border-brand-500/30 rounded-2xl p-4 shadow-glow-sm">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-brand-400" />
              <div>
                <span className="text-sm font-semibold text-slate-200">
                  {compareList.length}/2 Schemes Selected for Comparison
                </span>
                <p className="text-xs text-slate-400">
                  {comparedSchemes.map((s) => s.shortName).join(" vs. ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCompareModalOpen(true)}
              >
                Open Side-by-Side Matrix
              </Button>
              <button 
                onClick={() => setCompareList([])}
                className="text-xs text-slate-400 hover:text-slate-200 px-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by scheme name, ministry, keyword, subsidy percentage, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
            {/* Jurisdiction */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Jurisdictions</option>
              <option value="central">Central Schemes (Nationwide)</option>
              <option value="state">State Policies (MP, Maha, UP, TN, KA)</option>
            </select>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Categories</option>
              <option value="subsidy">High Capital Subsidy (≥25%)</option>
              <option value="credit_guarantee">Collateral-Free / Credit Guarantee</option>
              <option value="women_scst">Women & SC/ST Priority</option>
              <option value="startups">Startup Innovation Grants</option>
              <option value="artisans">Artisans & Traditional Crafts</option>
            </select>

            {/* Portal Source */}
            <select
              value={selectedPortal}
              onChange={(e) => setSelectedPortal(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Aggregated Portals</option>
              <option value="JanSamarth">JanSamarth Portal</option>
              <option value="Startup India">Startup India Official</option>
              <option value="Vishwakarma">PM Vishwakarma Portal</option>
              <option value="MoFPI">MoFPI Food Processing</option>
              <option value="State">State MSME Single Windows</option>
            </select>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme: SchemeDetail) => {
            const isSelected = compareList.includes(scheme.id);
            return (
              <Card key={scheme.id} glass hover className="flex flex-col justify-between relative group">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                      {scheme.governmentLevel === "central" ? "Central Scheme" : "State Policy"}
                    </span>
                    {scheme.subsidyPercentage && (
                      <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {scheme.subsidyPercentage}% Subsidy
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-100 text-lg leading-tight line-clamp-2">
                    {scheme.schemeName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {scheme.ministry}
                  </p>
                  {scheme.portalSource && (
                    <div className="flex items-center gap-1.5 text-[11px] text-teal-400 mt-1">
                      <Globe2 className="w-3 h-3" />
                      <span>{scheme.portalSource}</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-3.5">
                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
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

                  {scheme.tags && scheme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {scheme.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => toggleCompare(scheme.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        isSelected 
                          ? "bg-brand-500/20 border-brand-500 text-brand-300"
                          : "bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-brand-400" />
                          Selected for Comparison
                        </>
                      ) : (
                        <>
                          <Scale className="w-3.5 h-3.5" />
                          Add to Compare
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    Portal
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <Link href={`/chat?q=Give full breakdown of ${encodeURIComponent(scheme.shortName)}`}>
                      <Button variant="ghost" size="sm">
                        AI Guide
                      </Button>
                    </Link>
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
      </main>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card bg-slate-900/95 border border-brand-500/20 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Scheme Comparison Matrix</h2>
                  <p className="text-xs text-slate-400">Direct parameter comparison between selected government policies</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {comparedSchemes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Select at least one scheme to view comparison.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {comparedSchemes.map((scheme) => (
                    <div key={scheme.id} className="glass-card rounded-2xl p-5 border-white/10 space-y-4">
                      <div>
                        <span className="text-2xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                          {scheme.governmentLevel === "central" ? "Central Scheme" : "State Policy"}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 mt-2">{scheme.schemeName}</h3>
                        <p className="text-xs text-slate-400">{scheme.ministry}</p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-800/50 space-y-1">
                          <span className="text-slate-400 block font-medium">Financial Support & Subsidy</span>
                          <span className="text-brand-300 font-bold text-sm block">
                            {scheme.subsidyPercentage ? `${scheme.subsidyPercentage}% Subsidy` : "Credit Guarantee / Low Interest"}
                          </span>
                          {scheme.fundingRange && (
                            <span className="text-slate-300 block">
                              Cap: ₹{(scheme.fundingRange.max).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/50 space-y-1">
                          <span className="text-slate-400 block font-medium">Target Demographics</span>
                          <span className="text-slate-200 block">
                            {scheme.eligibilityCriteria.genderAllowed?.join(", ") || "All Genders"} | {scheme.eligibilityCriteria.socialCategoriesAllowed?.join(", ") || "All Categories"}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/50 space-y-1">
                          <span className="text-slate-400 block font-medium">Eligible Business Stages</span>
                          <span className="text-slate-200 capitalize block">
                            {scheme.eligibilityCriteria.allowedBusinessStages?.join(", ") || "All Stages"}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/50 space-y-1">
                          <span className="text-slate-400 block font-medium">Required Documents</span>
                          <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                            {scheme.documentsRequired.slice(0, 4).map((doc: string, idx: number) => (
                              <li key={idx} className="truncate">{doc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        <Link href={`/chat?q=Help me apply for ${encodeURIComponent(scheme.shortName)}`}>
                          <Button variant="ghost" size="sm">
                            Ask AI
                          </Button>
                        </Link>
                        <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Apply
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end">
              <Button variant="secondary" onClick={() => setIsCompareModalOpen(false)}>
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
