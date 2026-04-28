import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, FileText, Loader2, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const SKELETON_TEMPLATE = [
  { type: "heading", content: "Executive Summary" },
  { type: "text", content: "This report examines the current market positioning and future outlook for the subject company. Our analysis suggests significant upside potential driven by key catalysts in the sector." },
  { type: "heading", content: "Market Analysis" },
  { type: "bullets", content: "• Revenue growth accelerating QoQ with 23% YoY increase\n• Market share expanding in core segments\n• Competitive moat strengthening through R&D investment\n• Favorable regulatory tailwinds expected in H2 2026" },
  { type: "heading", content: "Valuation & Price Target" },
  { type: "text", content: "Using a DCF model with a 10% discount rate and 5-year projection period, we arrive at a fair value that suggests meaningful upside from current levels." },
  { type: "heading", content: "Summary & Recommendation" },
  { type: "text", content: "Based on our comprehensive analysis, we believe the risk/reward profile is highly favorable at current prices. Key catalysts include upcoming earnings, product launches, and potential M&A activity." },
];

export default function AISidebar({ isOpen, onClose, onGenerate }) {
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      if (topic.trim()) {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a professional financial analyst. Write a structured research report template about: "${topic}". Generate sections with these block types: heading, text, bullets. Return a JSON array of blocks. Each block has "type" (heading/text/bullets) and "content" (string). For bullets, start each line with "• ". Include: Executive Summary, Market Analysis (with 4-5 bullet points), Key Catalysts, Risks, Valuation & Price Target, Summary & Recommendation. Make content specific to "${topic}".`,
          response_json_schema: {
            type: "object",
            properties: {
              blocks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["heading", "text", "bullets"] },
                    content: { type: "string" },
                  },
                },
              },
            },
          },
        });
        onGenerate(res.blocks || SKELETON_TEMPLATE);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        onGenerate(SKELETON_TEMPLATE);
      }
    } catch {
      onGenerate(SKELETON_TEMPLATE);
    }
    setGenerating(false);
    onClose();
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
              <span className="font-bold text-sm">AI Template Generator</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Generate Template</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Enter a company or topic for an AI-written template, or leave blank for a generic structure.
              </p>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. NVIDIA, Tesla, Bitcoin..."
                className="mb-3 text-sm"
              />
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    {topic ? "Writing with AI..." : "Loading template..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                    {topic ? "Generate with AI" : "Use Generic Template"}
                  </>
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Generated content is fully editable in the editor.
              </p>
            </div>

            <div className="text-[11px] text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="font-semibold mb-1">Tips:</p>
              <ul className="space-y-1">
                <li>• Type <span className="font-mono text-primary">$TICKER</span> to embed live stock data</li>
                <li>• Use the chart block for visual technical analysis</li>
                <li>• Add DYOR disclaimer before publishing</li>
                <li>• Lock a price prediction to build credibility</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}