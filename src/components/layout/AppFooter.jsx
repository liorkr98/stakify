import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const FOOTER_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Scoring & Calculations", path: "/calculations" },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border/50 bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Stak<span className="text-primary">ify</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-xs">
            Not financial advice. For informational purposes only. Always do your own research.
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Stakify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}