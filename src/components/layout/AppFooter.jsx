import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const FOOTER_COLS = [
  {
    label: "Platform",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Features", path: "/features" },
      { label: "Pricing", path: "/pricing" },
      { label: "Newsroom", path: "/newsroom" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "Scoring & Calculations", path: "/calculations" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms & Conditions", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Cookie Policy", path: "/cookies" },
      { label: "Accessibility", path: "/accessibility" },
    ],
  },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border/50 bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Stak<span className="text-primary">ify</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The platform for verified financial analysis with publicly locked, trackable predictions.
            </p>
            <p className="text-xs text-muted-foreground mt-3 max-w-xs">
              ⚠️ Not financial advice. All content is for informational purposes only.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.label}>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{col.label}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Stakify, Inc. All rights reserved.</span>
          <span>Made for transparent finance 📈</span>
        </div>
      </div>
    </footer>
  );
}