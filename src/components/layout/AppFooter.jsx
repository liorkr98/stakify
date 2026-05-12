import React from "react";
import { Link } from "react-router-dom";
import StoaLogo from "@/components/StoaLogo";

const FOOTER_COLS = [
  {
    label: "Platform",
    links: [
      { label: "About Us",               path: "/about"        },
      { label: "Features",               path: "/features"     },
      { label: "Pricing",                path: "/pricing"      },
      { label: "How It Works",           path: "/how-it-works" },
      { label: "Newsroom",               path: "/newsroom"     },
      { label: "Scoring & Calculations", path: "/calculations" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms & Conditions", path: "/terms"         },
      { label: "Privacy Policy",     path: "/privacy"       },
      { label: "Cookie Policy",      path: "/cookies"       },
      { label: "Accessibility",      path: "/accessibility" },
    ],
  },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <StoaLogo size={22} textSize="text-base" className="mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Transparent financial research with verified, locked predictions. The home for serious market analysts.
            </p>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.label}>
              <p className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">{col.label}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 STOA. All rights reserved.</p>
          <p className="text-xs text-muted-foreground italic">Not financial advice. Always do your own research.</p>
        </div>
      </div>
    </footer>
  );
}
