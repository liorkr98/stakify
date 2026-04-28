import React from "react";
import { Eye } from "lucide-react";

const STANDARDS = [
  { label: "Keyboard Navigation", desc: "All interactive elements are accessible via keyboard. Focus indicators are visible and follow a logical order." },
  { label: "Screen Reader Support", desc: "Content is structured with semantic HTML and ARIA labels to support screen readers including NVDA, JAWS, and VoiceOver." },
  { label: "Color Contrast", desc: "Text and UI elements meet WCAG 2.1 AA minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text." },
  { label: "Responsive Design", desc: "The Platform is fully responsive and usable across desktop, tablet, and mobile devices without loss of content or functionality." },
  { label: "Text Resizing", desc: "Users can increase text size up to 200% without loss of content or functionality using browser zoom." },
  { label: "Alternative Text", desc: "Images and non-text content include alternative text descriptions for assistive technology users." },
  { label: "Error Identification", desc: "Form errors are clearly identified and described in text, not solely by color." },
];

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-semibold mb-4">
          <Eye className="w-4 h-4 text-primary" />
          Accessibility
        </div>
        <h1 className="text-4xl font-bold mb-2">Accessibility Statement</h1>
        <p className="text-muted-foreground">Last updated: April 28, 2026</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stakify is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards. Our goal is to conform to the <strong className="text-foreground">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
        </p>
      </div>

      <h2 className="font-bold text-lg mb-4">Our Accessibility Commitments</h2>
      <div className="space-y-3 mb-8">
        {STANDARDS.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex gap-4">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Known limitations:</strong> Some older embedded content and third-party widgets may not yet fully conform to WCAG 2.1 AA. We are actively working with our vendors to resolve these issues.</p>
        <p><strong className="text-foreground">Feedback & Contact:</strong> We welcome your feedback on accessibility. If you experience barriers accessing any content on Stakify, please contact us:</p>
        <ul className="space-y-1 ml-4">
          <li>Email: <a href="mailto:accessibility@stakify.com" className="text-primary hover:underline">accessibility@stakify.com</a></li>
          <li>We aim to respond to accessibility queries within 5 business days.</li>
        </ul>
        <p><strong className="text-foreground">Formal complaints:</strong> If you are not satisfied with our response, you may contact the relevant national accessibility authority in your country.</p>
      </div>
    </div>
  );
}