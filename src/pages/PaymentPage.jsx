import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ArrowLeft, Star, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SUBSCRIPTION_PLANS = [
  {
    key: "basic",
    label: "Basic",
    price: 9,
    period: "month",
    description: "For casual investors",
    features: ["All published reports", "Weekly market digest", "Email notifications", "Community comments"],
    color: "border-border",
    highlight: false,
  },
  {
    key: "pro",
    label: "Pro",
    price: 29,
    period: "month",
    description: "For serious analysts",
    features: ["Everything in Basic", "Locked predictions access", "Direct analyst DMs", "Weekly live Q&A calls", "Early report access", "Export reports to PDF"],
    color: "border-primary",
    highlight: true,
  },
];

function PaymentForm({ amount, label, onSuccess }) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Number</label>
        <div className="relative">
          <Input
            value={card}
            onChange={(e) => setCard(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="4242 4242 4242 4242"
            className="font-mono pr-10"
          />
          <CreditCard className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry</label>
          <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">CVC</label>
          <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" className="font-mono" />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        <Lock className="w-4 h-4 mr-2" />
        {loading ? "Processing..." : `Pay $${amount} — ${label}`}
      </Button>
      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption
      </p>
    </form>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "subscription"; // "report" | "subscription"
  const reportTitle = urlParams.get("title") || "NVIDIA: The AI Backbone Play for 2026";
  const reportPrice = parseFloat(urlParams.get("price") || "4.99");

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paid, setPaid] = useState(false);

  const handleSuccess = () => {
    setPaid(true);
    toast.success(mode === "report" ? "Report unlocked!" : "Subscription activated!", {
      description: mode === "report" ? "You can now read the full report." : "Welcome to Stakify Pro.",
    });
    setTimeout(() => navigate(-1), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {paid ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {mode === "report" ? "Report Unlocked!" : "Subscription Activated!"}
            </h2>
            <p className="text-muted-foreground">Redirecting you back...</p>
          </div>
        ) : mode === "report" ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-3">
                <Lock className="w-3.5 h-3.5" />
                Premium Report
              </div>
              <h1 className="text-2xl font-bold mb-2">{reportTitle}</h1>
              <p className="text-muted-foreground text-sm">One-time purchase — yours forever.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
                <span className="font-medium">Report Access</span>
                <span className="font-bold text-lg">${reportPrice.toFixed(2)}</span>
              </div>
              <ul className="space-y-2 mb-2">
                {["Full report access", "Locked prediction details", "Charts & data", "Fact-check analysis"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PaymentForm amount={reportPrice.toFixed(2)} label="Unlock Report" onSuccess={handleSuccess} />
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-3">
                <Star className="w-3.5 h-3.5" />
                Stakify Subscription
              </div>
              <h1 className="text-2xl font-bold mb-2">Unlock Full Access</h1>
              <p className="text-muted-foreground text-sm">Follow the best analysts and track verified predictions.</p>
            </div>

            {/* Plan Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <button
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`text-left rounded-xl border-2 p-5 transition-all ${
                    selectedPlan === plan.key
                      ? plan.highlight ? "border-primary bg-primary/5" : "border-foreground/30 bg-secondary"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base">{plan.label}</span>
                    {plan.highlight && (
                      <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                  <p className="text-2xl font-bold mb-4">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </p>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 ${selectedPlan === plan.key ? "text-primary" : "text-muted-foreground"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
                <span className="font-medium">{SUBSCRIPTION_PLANS.find((p) => p.key === selectedPlan)?.label} Plan</span>
                <span className="font-bold text-lg">
                  ${SUBSCRIPTION_PLANS.find((p) => p.key === selectedPlan)?.price}/mo
                </span>
              </div>
              <PaymentForm
                amount={`${SUBSCRIPTION_PLANS.find((p) => p.key === selectedPlan)?.price}/mo`}
                label={`${SUBSCRIPTION_PLANS.find((p) => p.key === selectedPlan)?.label} Plan`}
                onSuccess={handleSuccess}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}