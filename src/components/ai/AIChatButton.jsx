import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import AIChat from "./AIChat";

export default function AIChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          open ? "bg-foreground text-background scale-95" : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl"
        }`}
        title="Ask Staki AI"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      <AIChat isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}