"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { useProfileStore } from "@/lib/profileStore";
import { ragAssistant } from "@/lib/ragAssistant";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChatMessage } from "@niti-ai/types";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  ShieldCheck,
  UserCheck,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from "lucide-react";

function ChatAssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      role: "assistant",
      content: `### 🙏 Namaste ${profile.fullName || user?.displayName || "Entrepreneur"}!
I am **NITI Saathi (नीति साथी)** — your personal AI Government Scheme & Subsidy Mentor.

I can help you find non-repayable capital subsidies (up to 40%), collateral-free bank loans up to ₹5 Crore, and official application guides for your business in **English**, **हिंदी**, or **Hinglish**.

### 💡 How can I assist your business journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: [
        "Which scheme gives 35% subsidy for manufacturing?",
        "How can women entrepreneurs get ₹10L - ₹1Cr loan?",
        "Documents required for PMEGP loan",
        "Calculate subsidy for ₹15 Lakhs project"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== "") {
      const q = initialQuery.trim();
      const userMessage: ChatMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: q,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const timer = setTimeout(() => {
        const assistantResponse = ragAssistant.generateResponse(
          q,
          messages,
          profile.preferredLanguage || "en"
        );
        setMessages((prev) => [...prev, assistantResponse]);
        setIsTyping(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantResponse = ragAssistant.generateResponse(
        query,
        messages,
        profile.preferredLanguage || "en"
      );
      setMessages((prev) => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "reset-" + Date.now(),
        role: "assistant",
        content: `### 🙏 Namaste ${profile.fullName || user?.displayName || "Entrepreneur"}!
Conversation refreshed. What scheme, loan, or subsidy would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: [
          "Which scheme gives 35% subsidy for manufacturing?",
          "How to get collateral-free loan up to ₹10 Lakhs?",
          "Schemes for Women & SC/ST Entrepreneurs"
        ]
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      {/* Navigation Bar — Completely Horizontal Full Width */}
      <header className="glass-nav sticky top-0 z-50 w-full border-b border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-base tracking-tight gradient-text">
                    NITI Saathi (नीति साथी)
                  </h1>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    ChatGPT-Style Human Mentor
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  100% Self-Hosted • Unified National & State Scheme Intelligence
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" leftIcon={<UserCheck className="w-3.5 h-3.5" />}>
                My Profile
              </Button>
            </Link>
            <Link href="/schemes">
              <Button variant="ghost" size="sm">
                Directory
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              title="Reset conversation"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Stream — Completely Horizontal Full Width */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col justify-between max-w-full">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 w-full">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500/20 to-teal-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 shrink-0 mt-1 shadow-glow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`w-full rounded-3xl p-6 sm:p-7 shadow-xl ${
                  msg.role === "user"
                    ? "max-w-3xl bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow-sm ml-auto"
                    : "max-w-full glass-card text-slate-100 border border-white/10"
                }`}
              >
                {/* Clean Markdown Rendering — Eliminates raw ##, **, --- */}
                {msg.role === "assistant" ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <p className="text-sm sm:text-base leading-relaxed text-white font-medium">
                    {msg.content}
                  </p>
                )}

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                      <ShieldCheck className="w-4 h-4" />
                      Official Gazette Citation & Portal Evidence:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {msg.citations.map((c) => (
                        <div
                          key={c.schemeId}
                          className="bg-slate-900/80 rounded-2xl p-3 text-xs text-slate-300 border border-white/5 flex flex-col justify-between gap-1"
                        >
                          <div>
                            <span className="font-bold text-brand-300 block">{c.schemeName}</span>
                            <span className="text-slate-400 mt-0.5 block">{c.excerpt}</span>
                          </div>
                          <Link
                            href={`/schemes`}
                            className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-1 font-medium"
                          >
                            Explore in Directory <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contextual Smart Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                      Suggested Follow-up Questions (1-Click Exploration):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="text-xs px-4 py-2 rounded-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition-all duration-150 text-left hover:scale-[1.01] hover:border-brand-400 shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-3 ${
                    msg.role === "user" ? "text-brand-100/70 text-right" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 sm:gap-4 justify-start w-full">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="glass-card rounded-2xl px-6 py-4 text-xs sm:text-sm text-slate-300 flex items-center gap-3 border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping" />
                NITI Saathi is analyzing central and state gazettes & drafting response...
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Area — Completely Horizontal Full-Width Form */}
        <div className="sticky bottom-0 z-30 pt-3 pb-3 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 w-full mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex flex-col sm:flex-row gap-3 items-center w-full"
          >
            <div className="relative flex-1 w-full">
              <Input
                placeholder="Ask anything in English, हिंदी, or Hinglish (e.g. 35% subsidy on ₹20L manufacturing, Mudra loan documents, Women startup grants)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full text-sm sm:text-base py-3.5 pl-4 pr-12 rounded-2xl bg-slate-900/90 border-white/15 focus:border-brand-500/60 shadow-inner"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold shrink-0 shadow-glow-sm"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Ask NITI Saathi
            </Button>
          </form>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            NITI Saathi cross-checks information against official Ministry of MSME, JanSamarth, and State Industrial Policy Gazettes.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ChatAssistantPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading NITI Saathi AI...</div>}>
        <ChatAssistantContent />
      </Suspense>
    </AuthGuard>
  );
}
