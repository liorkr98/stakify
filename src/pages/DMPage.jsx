import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_ANALYSTS } from "@/lib/mockData";

export default function DMPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const analystId = urlParams.get("analyst") || "a2";
  const analyst = MOCK_ANALYSTS.find((a) => a.id === analystId) || MOCK_ANALYSTS[1];

  const [messages, setMessages] = useState([
    { id: 1, from: "analyst", text: "Thanks for subscribing! Happy to answer any questions about my analysis.", time: "2h ago" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "me", text: input.trim(), time: "just now" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "analyst", text: "Thanks for your message! I'll get back to you soon.", time: "just now" }]);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-80px)]">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl mb-4">
        <img src={analyst.avatar} alt={analyst.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-sm">{analyst.name}</p>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Lock className="w-3 h-3" />
            Subscribers only
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${
              msg.from === "me" ? "bg-primary text-white" : "bg-card border border-border"
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Send a message..."
          className="flex-1"
        />
        <Button onClick={send} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}