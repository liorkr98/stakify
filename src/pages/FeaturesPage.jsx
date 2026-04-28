import React from "react";
import { Lock, Target, Trophy, BarChart3, DollarSign, Users, ShieldCheck, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Lock, title: "Cryptographically Locked Predictions", desc: "Every prediction is time-stamped and locked at publication. No editing, no backdating. The entry price is captured live from the market at the exact moment of publish.", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { icon: Target, title: "Verified Accuracy Scoring", desc: "Stakify automatically resolves every prediction at the end of its stated timeframe, comparing the outcome to the original target price and direction.", color: "text-green-600 bg-green-50 border-green-200" },
  { icon: Trophy, title: "Global Analyst Leaderboard", desc: "Compete for the top spot based on accuracy, points, and yearly yield. Rankings are fully transparent and updated in real time.", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { icon: BarChart3, title: "Rich Report Editor", desc: "Write professional-grade research reports with headings, bullet points, live stock charts, image uploads, and financial disclaimers — all built in.", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { icon: ShieldCheck, title: "AI Fact Checker", desc: "Every report includes an AI-powered fact checker that classifies each claim as fact, opinion, misleading, or unverified — helping readers make informed decisions.", color: "text-primary bg-primary/10 border-primary/20" },
  { icon: Users, title: "Community Notes", desc: "Readers can add community notes to individual claims in a report — similar to Twitter's Community Notes — providing crowd-sourced context and corrections.", color: "text-sky-600 bg-sky-50 border-sky-200" },
  { icon: DollarSign, title: "Analyst Monetization", desc: "Analysts can sell reports one-time or gate content behind a monthly subscription. Full payment processing, analytics, and payout management built-in.", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { icon: Sparkles, title: "Staki AI Assistant", desc: "Our built-in AI assistant helps readers understand reports, compare analyst track records, and learn financial concepts — available on every page.", color: "text-violet-600 bg-violet-50 border-violet-200" },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Platform Features</h1>
        <p className="text-muted-foreground text-lg">Everything you need to research smarter and build a verified track record.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="bg-card border border-border rounded-xl p-5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${f.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}