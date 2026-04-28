import React from "react";
import { PenLine, Lock, BarChart3, Trophy, DollarSign } from "lucide-react";

const STEPS = [
  {
    num: "01", icon: PenLine, title: "Analysts Write Reports",
    desc: "Registered analysts write structured research reports using our editor — adding analysis, charts, ticker data, and a mandatory prediction block.",
  },
  {
    num: "02", icon: Lock, title: "Predictions Are Locked",
    desc: "When a report is published, the prediction (action, ticker, target price, timeframe) is immediately locked with a timestamp and the live entry price. It cannot be edited afterwards.",
  },
  {
    num: "03", icon: BarChart3, title: "Market Resolves the Outcome",
    desc: "At the end of the prediction timeframe, Stakify automatically fetches the real market price and calculates whether the prediction was correct, within range, or missed.",
  },
  {
    num: "04", icon: Trophy, title: "Scores & Points Are Updated",
    desc: "Accuracy scores and points are updated transparently. Correct predictions within 10% of target earn full points. Partial credit is given for directionally correct calls.",
  },
  {
    num: "05", icon: DollarSign, title: "Analysts Monetize Their Audience",
    desc: "Top analysts can gate reports behind a one-time purchase or require a subscription (Basic / Pro). Stakify takes a small platform fee; analysts keep the rest.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How Stakify Works</h1>
        <p className="text-muted-foreground text-lg">
          A transparent, gamified platform for verified financial analysis.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="bg-card border border-border rounded-xl p-5 flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{step.num}</span>
                  <h3 className="font-bold">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-4">For Readers & Followers</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {[
            "Browse the feed for free — read excerpts and see all locked predictions.",
            "Follow top analysts and get notified when they publish new reports.",
            "Use the leaderboard to discover who actually has a verifiable track record.",
            "Comment, fact-check, and reply to create community accountability.",
            "Subscribe to access premium reports and live prediction outcomes.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary font-bold mt-0.5">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}