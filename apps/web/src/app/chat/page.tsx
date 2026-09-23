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
  HelpCircle,
  ShieldCheck
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
      content: `Namaste ${user?.displayName || "Entrepreneur"}! I am your self-hosted NITI AI Assistant. You can ask me in **English**, **हिंदी**, or **Hinglish** about schemes, subsidies, loans, and eligibility criteria tailored to your business profile.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputText.trim();
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
    }, 400);
  };

  const handleQuickQuestion = (q: string) => {
    setInputText(q);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base tracking-tight gradient-text">
                  NITI AI Scheme Assistant
                </h1>
                <p className="text-[10px] text-teal-400 font-mono">100% Self-Hosted • Grounded</p>
              </div>
            </div>
          </div>

          <Link href="/schemes">
            <Button variant="ghost" size="sm">Browse Schemes</Button>
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-500 text-white shadow-glow-sm"
                    : "glass-card text-slate-100 border border-white/10"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Government Source Evidence:
                    </div>
                    {msg.citations.map((c) => (
                      <div
                        key={c.schemeId}
                        className="bg-white/5 rounded-lg p-2 text-xs text-slate-300 border border-white/5"
                      >
                        <span className="font-semibold text-brand-300">{c.schemeName}:</span>{" "}
                        <span>{c.excerpt}</span>
                      </div>
                    ))}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-brand-100/70 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="glass-card rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Retrieving policy gazettes & generating answer...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="pt-2 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
            Frequently Asked Multilingual Questions:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Which scheme gives 35% subsidy for rural manufacturing?",
              "Mujhe machinery khareedne ke liye collateral-free loan chahiye",
              "क्या महिलाओं के लिए विशेष स्टार्ट-अप योजनाएं उपलब्ध हैं?",
              "Madhya Pradesh MSME policy ke key benefits kya hain?"
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask in English, Hindi, or Hinglish (e.g. Loan subsidy details, document list)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" leftIcon={<Send className="w-4 h-4" />}>
            Send
          </Button>
        </form>
      </main>
    </div>
  );
}

export default function ChatAssistantPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading AI Assistant...</div>}>
        <ChatAssistantContent />
      </Suspense>
    </AuthGuard>
  );
}
