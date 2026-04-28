import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const SYSTEM_PROMPT = `You are Staki, the AI assistant for Stakify — a financial research platform where verified analysts publish reports with locked predictions. 

You help users:
- Understand analyst predictions and reports on the platform
- Explain financial concepts (DCF, P/E ratios, etc.) simply
- Compare analysts' track records and accuracy
- Discuss market trends and sectors
- Answer questions about how Stakify works (predictions are locked at publish time, accuracy scoring, points system)

Be concise, professional, and always remind users that nothing on Stakify is financial advice. Keep responses short and to the point unless depth is requested.`;

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm **Staki**, your Stakify AI assistant. I can help you understand reports, analyst track records, financial concepts, or how the platform works. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    const conversationHistory = newMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationHistory}\n\nAssistant:`,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: typeof res === "string" ? res : res?.text || "I'm not sure about that. Could you rephrase?" }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-96 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Staki AI</p>
              <p className="text-[10px] text-muted-foreground">Your Stakify research assistant</p>
            </div>
            <button onClick={onClose} className="ml-auto p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-0.5 [&_strong]:font-semibold">
                      {msg.content}
                    </ReactMarkdown>
                  ) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-secondary/20">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about reports, analysts, or markets..."
                rows={1}
                className="flex-1 resize-none text-sm bg-card border border-border rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60 max-h-24 overflow-y-auto"
                style={{ lineHeight: "1.4" }}
              />
              <Button
                size="icon"
                onClick={send}
                disabled={!input.trim() || loading}
                className="h-9 w-9 rounded-xl flex-shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">Not financial advice. For informational purposes only.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}