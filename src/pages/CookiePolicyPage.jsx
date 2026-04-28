import React from "react";
import { Cookie } from "lucide-react";

const COOKIE_TYPES = [
  { name: "Strictly Necessary", required: true, desc: "These cookies are essential for the Platform to function. They enable core features like login sessions, security tokens, and payment flows. These cannot be disabled." },
  { name: "Analytics & Performance", required: false, desc: "We use analytics cookies (e.g., anonymous usage data) to understand how users interact with the Platform. This helps us improve features and fix bugs. No personally identifiable data is shared with third parties." },
  { name: "Functionality", required: false, desc: "These remember your preferences such as display settings, notification preferences, and feed filters to provide a personalised experience." },
  { name: "Marketing & Advertising", required: false, desc: "Stakify does not currently serve third-party advertising. We may use first-party tracking to measure the effectiveness of our own promotional campaigns." },
];

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-semibold mb-4">
          <Cookie className="w-4 h-4 text-primary" />
          Legal
        </div>
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: April 28, 2026</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">Stakify uses cookies and similar tracking technologies to operate the Platform, analyse usage, and improve your experience. This policy explains what cookies we use, why, and how you can control them.</p>
      </div>

      <div className="space-y-4 mb-8">
        {COOKIE_TYPES.map((c) => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{c.name}</h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${c.required ? "bg-green-50 text-green-700 border-green-200" : "bg-secondary text-muted-foreground border-border"}`}>
                {c.required ? "Always Active" : "Optional"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">How to manage cookies:</strong> You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect Platform functionality. Most browsers offer privacy modes and granular cookie controls.</p>
        <p><strong className="text-foreground">Third-party cookies:</strong> Some third-party services we integrate (such as payment processors) may set their own cookies. We do not control these and recommend reviewing their respective privacy policies.</p>
        <p><strong className="text-foreground">Contact:</strong> privacy@stakify.com</p>
      </div>
    </div>
  );
}