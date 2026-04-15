import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SKELETON_TEMPLATE = [
  { type: "heading", content: "Executive Summary" },
  { type: "text", content: "This report examines the current market positioning and future outlook for the subject company. Our analysis suggests significant upside potential driven by key catalysts in the sector." },
  { type: "heading", content: "Market Analysis" },
  { type: "bullets", content: "• Revenue growth accelerating QoQ with 23% YoY increase\n• Market share expanding in core segments\n• Competitive moat strengthening through R&D investment\n• Favorable regulatory tailwinds expected in H2 2026" },
  { type: "text", content: "The broader macro environment remains supportive with interest rate cuts anticipated and consumer spending holding steady across key demographics." },
  { type: "heading", content: "Valuation & Price Target" },
  { type: "text", content: "Using a DCF model with a 10% discount rate and 5-year projection period, we arrive at a fair value that suggests meaningful upside from current levels. Our bull case scenario factors in accelerated adoption of AI-driven products." },
  { type: "heading", content: "Summary & Recommendation" },
  { type: "text", content: "Based on our comprehensive analysis, we believe the risk/reward profile is highly favorable at current prices. Key catalysts include upcoming earnings, product launches, and potential M&A activity." },
];

export default function AISidebar({ isOpen, onClose, onGenerate }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 1500));
    onGenerate(SKELETON_TEMPLATE);
    setGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border z-40 flex flex-col shadow-2xl"
        >
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-bold text-sm">AI Assistant</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Generative Skeleton</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Auto-fill the editor with a professional report template including Executive Summary, Market Analysis, and Recommendation sections.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    Generate Template
                  </>
                )}
              </Button>
            </div>

            <div className="text-[11px] text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="font-semibold mb-1">Tips:</p>
              <ul className="space-y-1">
                <li>• Type <span className="font-mono text-primary">$TICKER</span> to add live stock data</li>
                <li>• Use the chart block for visual analysis</li>
                <li>• Fill the Prediction Block before publishing</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}