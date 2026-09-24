"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { useProfileStore } from "@/lib/profileStore";
import { ragAssistant } from "@/lib/ragAssistant";
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
  RefreshCw
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
      content: `🙏 **Namaste ${profile.fullName || user?.displayName || "Entrepreneur"}!** I am **NITI Saathi (नीति साथी)** — your personal AI Government Scheme & Subsidy Mentor.\n\nI can help you find non-repayable capital subsidies (up to 40%), collateral-free bank loans up to ₹5 Crore, and official application guides for your business in **English**, **हिंदी**, or **Hinglish**.\n\n💡 How can I assist your business journey today?`,
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
        content: `🙏 **Namaste ${profile.fullName || user?.displayName || "Entrepreneur"}!** Conversation refreshed. What scheme, loan, or subsidy would you like to explore next?`,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    ChatGPT-Style Human Mentor
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  100% Self-Hosted • Verified Government Gazettes & Portals
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

      {/* Main Chat Stream */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-5 pb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-teal-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 shrink-0 mt-0.5">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-5 text-sm leading-relaxed shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow-sm"
                    : "glass-card text-slate-100 border border-white/10"
                }`}
              >
                <div className="whitespace-pre-line space-y-2 prose-invert">
                  {msg.content}
                </div>

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Source Evidence:
                    </div>
                    {msg.citations.map((c) => (
                      <div
                        key={c.schemeId}
                        className="bg-slate-900/60 rounded-xl p-2.5 text-xs text-slate-300 border border-white/5"
                      >
                        <span className="font-semibold text-brand-300">{c.schemeName}:</span>{" "}
                        <span>{c.excerpt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contextual Smart Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                      💡 Suggested Follow-up Questions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="text-xs px-3 py-1.5 rounded-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/20 transition-all duration-150 text-left hover:scale-[1.02]"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-2 ${
                    msg.role === "user" ? "text-brand-100/70 text-right" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="glass-card rounded-2xl px-5 py-3.5 text-xs text-slate-300 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                NITI Saathi is calculating policy guidelines & drafting response...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2.5"
          >
            <Input
              placeholder="Ask anything in English, हिंदी, or Hinglish (e.g. Subsidy on ₹20 Lakhs, Mudra documents, Women quotas)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-sm bg-slate-900/90 border-white/10 focus:border-brand-500/50"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
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
