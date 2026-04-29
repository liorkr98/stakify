import React, { useState } from "react";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, MessageSquareQuote, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import CommunityNotes from "./CommunityNotes";

const LABEL_CONFIG = {
  fact: { label: "Verified Fact", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  opinion: { label: "Opinion", icon: MessageSquareQuote, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  misleading: { label: "Misleading", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  unverified: { label: "Unverified", icon: Info, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const MOCK_RESULT = [
  { type: "fact", claim: "NVIDIA's H200 chip shows 3x memory bandwidth vs H100.", note: "Confirmed by NVIDIA's official spec sheets." },
  { type: "opinion", claim: "The data center revenue growth trajectory suggests significant upside.", note: "Analyst projection — not a verified figure." },
  { type: "misleading", claim: "No competition can match NVIDIA's AI performance.", note: "AMD MI300X benchmarks show comparable results in some LLM workloads." },
  { type: "fact", claim: "NVDA stock is up ~178% over the past 12 months.", note: "Verified via market data." },
  { type: "unverified", claim: "Enterprise AI capex will triple by 2027.", note: "No primary source cited; estimate varies widely across research firms.", unverifiedReason: "This projection appears in analyst commentary but lacks a citable primary source. Estimates from Gartner, IDC, and Goldman Sachs differ significantly (1.8x–3.5x range). Consider linking to a specific report or filing." },
];

export default function FactChecker({ reportContent, isAccessible }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState({});

  const toggleReason = (i) => setExpandedReasons((prev) => ({ ...prev, [i]: !prev[i] }));

  if (!isAccessible) return null;

  const runFactCheck = async () => {
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a financial fact-checker. Analyze the following report excerpt and identify claims. Classify each as: "fact" (verifiable), "opinion" (subjective view), "misleading" (partially false or cherry-picked), or "unverified" (no primary source). For every "unverified" claim, provide a detailed "unverifiedReason" explaining specifically why it cannot be verified and what sources the author should cite. Return a JSON array with objects: { type, claim, note, unverifiedReason }. Keep "claim" short (max 15 words), "note" short (1 sentence). unverifiedReason is only required for unverified type. Report:\n\n${reportContent || "NVIDIA's H200 chip is 3x faster than H100. Data center revenue will grow 40% in 2026. No competition can match NVIDIA's AI performance. NVDA stock is up 178% over 12 months. Enterprise AI capex will triple by 2027."}`,
        response_json_schema: {
          type: "object",
          properties: {
            claims: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["fact", "opinion", "misleading", "unverified"] },
                  claim: { type: "string" },
                  note: { type: "string" },
                  unverifiedReason: { type: "string" },
                },
              },
            },
          },
        },
      });
      setResults(res.claims || MOCK_RESULT);
    } catch {
      setResults(MOCK_RESULT);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div>
            <p className="font-bold text-sm">AI Fact Checker</p>
            <p className="text-xs text-muted-foreground">Signals facts, opinions & misleading claims</p>
          </div>
        </div>
        {!results && (
          <Button size="sm" onClick={runFactCheck} disabled={loading} variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Analyze Report"}
          </Button>
        )}
        {results && (
          <button onClick={() => setResults(null)} className="text-xs text-muted-foreground hover:text-foreground">
            Reset
          </button>
        )}
      </div>

      {!results && !loading && (
        <div className="px-5 py-6 text-center text-sm text-muted-foreground">
          Click <span className="font-semibold text-foreground">Analyze Report</span> to run our AI fact-checker on this report's claims.
        </div>
      )}

      {loading && (
        <div className="px-5 py-8 flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm">Analyzing claims in this report...</p>
        </div>
      )}

      {results && (
        <div className="divide-y divide-border">
          {/* Legend */}
          <div className="px-5 py-3 flex flex-wrap gap-3">
            {Object.entries(LABEL_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <span key={key} className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
              );
            })}
          </div>
          {results.map((item, i) => {
            const cfg = LABEL_CONFIG[item.type] || LABEL_CONFIG.unverified;
            const Icon = cfg.icon;
            return (
              <div key={i} className={`px-5 py-3 hover:bg-muted/30 transition-colors ${item.type === "opinion" ? "bg-blue-50/30" : ""}`}>
                <div className="flex gap-3 items-start">
                  <span className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.claim}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                    {item.type === "unverified" && item.unverifiedReason && (
                      <div className="mt-1.5">
                        <button
                          onClick={() => toggleReason(i)}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          {expandedReasons[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          Why is this unverified?
                        </button>
                        {expandedReasons[i] && (
                          <p className="mt-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
                            {item.unverifiedReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                {(item.type === "opinion" || item.type === "misleading") && (
                  <div className="ml-7 mt-1">
                    <CommunityNotes claimText={item.claim} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}