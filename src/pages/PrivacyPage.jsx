import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  { title: "1. Information We Collect", body: "We collect: (a) Account information — name, email address, and profile data you provide during registration; (b) Usage data — pages visited, reports read, interactions, and time spent; (c) Payment information — processed securely by our third-party payment processor (we do not store full card details); (d) Device and technical data — IP address, browser type, device identifiers, and cookies." },
  { title: "2. How We Use Your Information", body: "We use your data to: provide and improve the Platform; process payments and subscriptions; send transactional and product emails; personalize your experience and recommendations; detect fraud and ensure platform security; comply with legal obligations; conduct analytics to understand usage patterns." },
  { title: "3. Sharing Your Information", body: "We do not sell your personal data. We share data only with: (a) Payment processors for subscription and purchase processing; (b) Analytics providers to understand platform usage; (c) Legal authorities when required by law; (d) Service providers who operate under data processing agreements with us.\n\nAnalyst public profiles, report content, and prediction track records are visible to all users by design." },
  { title: "4. Data Retention", body: "We retain account data for as long as your account is active, plus up to 3 years after closure for legal compliance. You may request deletion of your personal data by emailing privacy@stakify.com." },
  { title: "5. Your Rights (GDPR / CCPA)", body: "Depending on your jurisdiction, you have the right to: access your personal data; correct inaccurate data; request deletion ('right to be forgotten'); object to or restrict processing; data portability; withdraw consent at any time.\n\nTo exercise these rights, contact: privacy@stakify.com. EU residents may lodge a complaint with their supervisory authority." },
  { title: "6. Security", body: "We implement industry-standard security measures including encryption in transit (TLS), encrypted storage for sensitive data, and regular security audits. No system is 100% secure. In the event of a data breach affecting your rights, we will notify you as required by applicable law." },
  { title: "7. Cookies", body: "We use cookies for authentication, analytics, and personalization. See our Cookie Policy for full details. You may control cookies through your browser settings." },
  { title: "8. Children's Privacy", body: "Stakify is not directed at users under 18 years of age. We do not knowingly collect personal data from minors. If you believe a minor has provided us data, contact privacy@stakify.com immediately." },
  { title: "9. Changes to This Policy", body: "We may update this Policy periodically. We will notify you of material changes via email or prominent notice on the Platform. Continued use after changes constitutes acceptance." },
  { title: "10. Contact", body: "For privacy questions or data requests:\nEmail: privacy@stakify.com\nStakify, Inc., 548 Market St, San Francisco, CA 94104, USA" },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-semibold mb-4">
          <Shield className="w-4 h-4 text-primary" />
          Legal
        </div>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 28, 2026</p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-2">{s.title}</h3>
            {s.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{para}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}