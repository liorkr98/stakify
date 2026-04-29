import React from "react";
import { Target, Lock, TrendingUp, Zap, ShieldCheck, CheckCircle2, MessageSquareQuote, AlertTriangle, Info } from "lucide-react";

const SECTIONS = [
  {
    icon: Target,
    title: "Accuracy Score",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    content: [
      { label: "What it measures", text: "The percentage of predictions that hit their target price within the stated timeframe." },
      { label: "Exact hit (within 5%)", text: "100% credit → counts as a fully correct prediction." },
      { label: "Near hit (5–15% from target)", text: "50% credit → counts as a partial prediction." },
      { label: "Directionally correct (15–30%)", text: "25% credit → wrong magnitude but right direction." },
      { label: "Miss", text: "0% credit. Both directional misses and expired timeframes count as misses." },
      { label: "Formula", text: "Accuracy = (Σ prediction credits) ÷ (total predictions) × 100" },
    ],
  },
  {
    icon: Lock,
    title: "Lock Price & Price Target",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    content: [
      { label: "Lock Price", text: "The live market price at the exact second the analyst clicks 'Publish'. This is fetched from our real-time data feed and cannot be altered." },
      { label: "Price Target", text: "The analyst's stated price target for the ticker within the specified timeframe. This is also locked at publish time." },
      { label: "Outcome check", text: "At timeframe expiry, we fetch the closing price on that date and compare it to the lock price + direction (Long/Short) and target." },
      { label: "Long example", text: "Lock $100, Target $130, 6 months. If price hits $128 → near hit (50% credit). If $135 → exact hit (100% credit). If $95 → miss." },
      { label: "Short example", text: "Lock $200, Target $150, 3 months. Credit is awarded if price falls below or near the target within the window." },
    ],
  },
  {
    icon: Zap,
    title: "Points System",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    content: [
      { label: "Exact prediction hit", text: "+100 points" },
      { label: "Near hit (within 15%)", text: "+50 points" },
      { label: "Directional hit (within 30%)", text: "+25 points" },
      { label: "Publishing a report", text: "+10 points" },
      { label: "Gaining 100 likes on a report", text: "+20 points" },
      { label: "First report of the month", text: "+15 bonus points" },
      { label: "Prediction miss", text: "−20 points (to discourage spam predictions)" },
      { label: "Streak bonus", text: "3+ correct predictions in a row: +50 bonus points per streak extension" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Yearly Yield",
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20",
    content: [
      { label: "What it measures", text: "The hypothetical portfolio return if you had followed the analyst's Long/Short calls with equal-weight positions." },
      { label: "Methodology", text: "Each prediction is treated as a 1-unit trade. Return = (exit price − lock price) ÷ lock price × direction multiplier (Long=+1, Short=−1)." },
      { label: "Annualization", text: "Returns are annualized using the actual timeframe of each prediction to produce a comparable yearly figure." },
      { label: "Benchmark", text: "We compare each analyst's yearly yield against the S&P 500 return for the same period to show alpha generation." },
      { label: "Note", text: "This is a paper trading metric only. It does not account for slippage, fees, position sizing, or taxes." },
    ],
  },
];

export default function CalculationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Scoring & Calculations</h1>
        <p className="text-muted-foreground text-lg">
          Full transparency on how every score, point, and yield metric is calculated.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className={`border rounded-2xl overflow-hidden`}>
              <div className={`flex items-center gap-3 px-6 py-4 border-b ${section.bg}`}>
                <Icon className={`w-5 h-5 ${section.color}`} />
                <h2 className={`font-bold text-lg ${section.color}`}>{section.title}</h2>
              </div>
              <div className="bg-card divide-y divide-border">
                {section.content.map((item) => (
                  <div key={item.label} className="px-6 py-3.5 flex gap-4">
                    <span className="text-sm font-semibold text-foreground w-48 flex-shrink-0">{item.label}</span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Fact Checker Section */}
      <div className="border rounded-2xl overflow-hidden mt-2">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-violet-50 border-violet-200">
          <ShieldCheck className="w-5 h-5 text-violet-600" />
          <h2 className="font-bold text-lg text-violet-600">AI Fact Checker</h2>
        </div>
        <div className="bg-card divide-y divide-border">
          {[
            { label: "What it does", text: "The AI Fact Checker scans every claim in a report and classifies it into one of four categories — Fact, Opinion, Misleading, or Unverified — using large language models with access to financial data sources." },
            { label: "Fact", text: "A verifiable, objective claim backed by publicly available data (e.g. earnings reports, official filings, audited financials). The AI cross-references statements with known data points.", icon: CheckCircle2, color: "text-green-600" },
            { label: "Opinion", text: "A subjective view, forecast, or interpretation by the analyst. Opinions are not right or wrong — they reflect the analyst's judgment. Community Notes can be added to debate these.", icon: MessageSquareQuote, color: "text-blue-600" },
            { label: "Misleading", text: "A claim that is technically true but omits important context, cherry-picks data, or creates a false impression. These are flagged with a warning and Community Notes are enabled.", icon: AlertTriangle, color: "text-red-600" },
            { label: "Unverified", text: "A claim for which no primary source could be found. It may be correct but cannot be confirmed. Analysts are encouraged to cite sources for these claims.", icon: Info, color: "text-amber-600" },
            { label: "Community Notes", text: "For Opinion and Misleading claims, readers can contribute Community Notes — short factual clarifications backed by evidence. Notes that receive enough upvotes are displayed under the claim." },
            { label: "Important caveat", text: "The AI Fact Checker is a tool to aid critical thinking, not a final arbiter of truth. Models can make errors. Always verify claims independently before making investment decisions." },
          ].map((item) => (
            <div key={item.label} className="px-6 py-3.5 flex gap-4 items-start">
              <div className="w-48 flex-shrink-0 flex items-center gap-1.5">
                {item.icon && React.createElement(item.icon, { className: `w-3.5 h-3.5 ${item.color}` })}
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-muted/50 border border-border rounded-xl p-5 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Important:</span> All metrics are for informational purposes only. Past accuracy does not guarantee future performance. Always do your own research before investing.
        </p>
      </div>
    </div>
  );
}