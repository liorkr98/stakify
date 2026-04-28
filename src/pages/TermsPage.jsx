import React, { useState } from "react";
import { CheckSquare, Square, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { title: "1. Acceptance of Terms", body: `By accessing or using Stakify ("the Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, do not use the Platform.\n\nThese Terms constitute a legally binding agreement between you ("User") and Stakify, Inc. ("Company", "we", "us"). We reserve the right to modify these Terms at any time with notice provided through the Platform.` },
  { title: "2. Not Financial Advice — Critical Disclaimer", body: `IMPORTANT: ALL CONTENT ON STAKIFY IS FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. NOTHING ON THIS PLATFORM CONSTITUTES FINANCIAL, INVESTMENT, LEGAL, TAX, OR TRADING ADVICE.\n\nStakify is a publishing and research platform. Analyst reports, predictions, and commentary represent the personal views of individual registered analysts and do not constitute recommendations to buy, sell, or hold any security, asset, or financial instrument.\n\nPast prediction accuracy does not guarantee future results. The Company expressly disclaims any liability for investment decisions made based on content published on the Platform. Always consult a qualified financial advisor before making any investment decision.` },
  { title: "3. Analyst Content and Accuracy", body: `Analysts on Stakify are independent content creators. The Company does not verify, endorse, or guarantee the accuracy of any analyst's research, predictions, or opinions. Analysts are solely responsible for the accuracy and legality of their content.\n\nBy publishing content, analysts represent that: (a) they own or have the right to publish such content; (b) their content does not violate applicable securities laws, including market manipulation, pump-and-dump schemes, or insider trading; (c) they will not make materially false or misleading statements.` },
  { title: "4. No Securities License", body: `Stakify is not a registered broker-dealer, investment adviser, or securities exchange. The Company does not hold, manage, or facilitate any financial transactions between users. No content on the Platform should be construed as a securities offering or solicitation.` },
  { title: "5. User Conduct", body: `You agree not to use the Platform to: (a) spread false, misleading, or fraudulent financial information; (b) engage in market manipulation, pump-and-dump schemes, or coordinated trading activity; (c) impersonate any person or entity; (d) violate any applicable laws or regulations, including securities laws; (e) harvest data or use automated tools without consent; (f) upload malicious code or disrupt Platform operations.` },
  { title: "6. Intellectual Property", body: `All Platform content, design, code, trademarks, and logos are owned by Stakify, Inc. or its licensors. Analyst-authored content remains the intellectual property of the analyst. By publishing on the Platform, analysts grant Stakify a non-exclusive, worldwide, royalty-free license to display and distribute their content through the Platform.` },
  { title: "7. Payments, Subscriptions, and Refunds", body: `All payments are processed through secure third-party processors. Subscriptions auto-renew unless cancelled before the billing date. One-time report purchases are non-refundable after access is granted. Stakify takes a 15% platform fee on analyst revenue. Analysts are responsible for their own tax obligations on earnings.` },
  { title: "8. Limitation of Liability", body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, STAKIFY AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, ARISING FROM YOUR USE OF THE PLATFORM OR RELIANCE ON ANY CONTENT THEREON.\n\nOur total aggregate liability shall not exceed the amount you paid to us in the 12 months preceding the claim.` },
  { title: "9. Indemnification", body: `You agree to indemnify and hold harmless Stakify, Inc. and its affiliates, officers, and employees from any claims, damages, or expenses (including legal fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any third party's rights; or (d) content you publish on the Platform.` },
  { title: "10. Governing Law and Disputes", body: `These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law provisions. Any dispute shall be resolved through binding arbitration under the rules of the American Arbitration Association, on an individual basis. Class action lawsuits are waived to the fullest extent permitted by law.` },
  { title: "11. Termination", body: `Stakify reserves the right to suspend or terminate your account at any time for violation of these Terms, without prior notice. Upon termination, your right to use the Platform ceases immediately.` },
  { title: "12. Contact", body: `For legal inquiries: legal@stakify.com\nFor general support: support@stakify.com\nStakify, Inc., 548 Market St, San Francisco, CA 94104, USA` },
];

export default function TermsPage({ showCheckbox = false, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-semibold mb-4">
          <Shield className="w-4 h-4 text-primary" />
          Legal
        </div>
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: April 28, 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 font-medium">⚠️ Important: Stakify is not a financial advisor. All content is for informational purposes only. Nothing constitutes financial advice. See Section 2 for our full disclaimer.</p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-3 text-foreground">{s.title}</h3>
            {s.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{para}</p>
            ))}
          </div>
        ))}
      </div>

      {showCheckbox && (
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <button
            onClick={() => setAccepted(!accepted)}
            className="flex items-start gap-3 w-full text-left"
          >
            {accepted ? <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> : <Square className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
            <p className="text-sm text-foreground/85 leading-relaxed">
              I have read and agree to the Stakify <strong>Terms & Conditions</strong>, <strong>Privacy Policy</strong>, and <strong>Cookie Policy</strong>. I understand that all content on Stakify is for informational purposes only and does not constitute financial advice.
            </p>
          </button>
          {onAccept && (
            <Button onClick={onAccept} disabled={!accepted} className="mt-4 w-full">
              Accept & Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}