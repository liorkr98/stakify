import React from "react";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "For curious readers and casual investors.",
    features: ["Browse all public reports", "See locked predictions (no full content)", "Follow analysts", "Basic leaderboard access", "Community comments"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    desc: "For active followers who want full access.",
    features: ["Everything in Free", "Full premium report access", "Weekly analyst digest email", "Historical prediction outcomes", "Priority comment ranking"],
    cta: "Start Basic",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For serious investors tracking the best analysts.",
    features: ["Everything in Basic", "Locked predictions live feed", "Direct message analysts", "Weekly live Q&A sessions", "Export prediction data (CSV)", "Early access to new features"],
    cta: "Start Pro",
    highlight: true,
    badge: "Most Popular",
  },
];

const ANALYST_PLANS = [
  { name: "Analyst Free", price: "$0", features: ["Publish unlimited free reports", "Public prediction tracking", "Basic analytics", "Leaderboard visibility"] },
  { name: "Analyst Pro", price: "$19/mo", features: ["Everything in Free", "Monetize reports (one-time & subscriptions)", "Advanced analytics & insights", "Promote reports", "Verified badge", "Priority support"] },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more.</p>
      </div>

      {/* Reader Plans */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">For Readers & Investors</h2>
      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${plan.highlight ? "border-primary/40 bg-primary/5 shadow-lg" : "border-border bg-card"}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" /> {plan.badge}
                </span>
              </div>
            )}
            <div className="mb-5">
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.desc}</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => navigate("/pay?mode=subscription")}
              variant={plan.highlight ? "default" : "outline"}
              className={plan.highlight ? "" : "border-border"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Analyst Plans */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">For Analysts & Content Creators</h2>
      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {ANALYST_PLANS.map((plan) => (
          <div key={plan.name} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="mb-5">
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <span className="text-2xl font-bold text-primary">{plan.price}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">All prices in USD. Cancel any time. Stakify takes a 15% platform fee on analyst revenue. By subscribing you agree to our <a href="/terms" className="underline hover:text-foreground">Terms & Conditions</a>.</p>
    </div>
  );
}