import React, { useState } from "react";
import { DollarSign, Lock, Users, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MODES = [
  {
    key: "free",
    label: "Free",
    description: "Visible to everyone",
    icon: Users,
    color: "border-border text-muted-foreground",
    active: "border-primary/40 bg-primary/5 text-primary",
  },
  {
    key: "paid",
    label: "Paid Report",
    description: "One-time purchase to read",
    icon: DollarSign,
    color: "border-border text-muted-foreground",
    active: "border-accent/40 bg-accent/5 text-accent",
  },
  {
    key: "subscribers",
    label: "Subscribers Only",
    description: "Requires an active subscription",
    icon: Lock,
    color: "border-border text-muted-foreground",
    active: "border-chart-4 bg-blue-500/5 text-blue-400",
  },
];

const SUBSCRIPTION_TIERS = [
  { key: "basic", label: "Basic", price: "9", perks: ["All reports", "Weekly digest"] },
  { key: "pro", label: "Pro", price: "29", perks: ["All reports", "Locked predictions", "DMs", "Weekly calls"] },
];

export default function MonetizationPanel() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("free");
  const [price, setPrice] = useState("4.99");
  const [subTier, setSubTier] = useState("basic");

  return (
    <div className="mt-8 border border-border/50 rounded-xl overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-secondary/40 hover:bg-secondary/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm">Monetization</span>
          {mode !== "free" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
              {mode === "paid" ? `$${price} per report` : `Subscribers only`}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 py-5 space-y-5 bg-card/50">
          {/* Access mode selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Access Mode
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => {
                const Icon = m.icon;
                const isActive = mode === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                      isActive ? m.active : "border-border hover:border-border/80 text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-[11px] opacity-70">{m.description}</p>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paid report: price input */}
          {mode === "paid" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Report Price (USD)
              </p>
              <div className="flex items-center gap-2 max-w-[180px]">
                <span className="text-muted-foreground font-mono text-sm">$</span>
                <Input
                  type="number"
                  min="0.99"
                  step="0.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="font-mono bg-secondary border-border"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Readers pay once to unlock this specific report.
              </p>
            </div>
          )}

          {/* Subscribers only: tier picker */}
          {mode === "subscribers" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Required Subscription Tier
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUBSCRIPTION_TIERS.map((tier) => {
                  const isActive = subTier === tier.key;
                  return (
                    <button
                      key={tier.key}
                      onClick={() => setSubTier(tier.key)}
                      className={cn(
                        "flex flex-col gap-2 px-4 py-3 rounded-lg border text-left transition-all",
                        isActive
                          ? "border-blue-500/40 bg-blue-500/5"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-bold", isActive ? "text-blue-400" : "text-foreground")}>
                          {tier.label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-muted-foreground">
                          ${tier.price}<span className="text-xs font-normal">/mo</span>
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {tier.perks.map((p) => (
                          <li key={p} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Only subscribers on this tier or higher can read this report.
              </p>
            </div>
          )}

          {mode !== "free" && (
            <div className="pt-1 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                💡 Set up your subscription tiers and payouts in{" "}
                <span className="text-primary cursor-pointer hover:underline">Account Settings → Monetization</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}