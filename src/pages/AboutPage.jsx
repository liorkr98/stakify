import React from "react";
import { TrendingUp, Shield, Target, Users } from "lucide-react";

const PILLARS = [
  { icon: Shield, title: "Verified Predictions", desc: "Every analyst's prediction is cryptographically timestamped at submission, making it impossible to backdate or alter." },
  { icon: Target, title: "Accuracy Tracking", desc: "We measure every analyst's predictions against real market outcomes to produce a transparent, unbiased accuracy score." },
  { icon: TrendingUp, title: "Skin in the Game", desc: "Analysts build their reputation publicly. High accuracy earns points, followers, and income — bad calls cost rank." },
  { icon: Users, title: "Community Intelligence", desc: "Thousands of investors fact-check, debate, and surface signal from noise through likes, comments, and the leaderboard." },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
          <TrendingUp className="w-4 h-4" />
          About Stakify
        </div>
        <h1 className="text-4xl font-bold mb-4">Built for Transparent Finance</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Stakify is a platform where financial analysts publish research reports with publicly locked, verifiable predictions — creating a new standard of accountability in investment analysis.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          The financial media is full of opinions dressed up as expertise. Stakify cuts through the noise by making every prediction public, time-stamped, and tracked against real market outcomes. We believe that accountability is the foundation of trustworthy financial analysis.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Anyone can make a bold call. Only the best analysts can back it up with a proven track record — and on Stakify, that record is completely transparent.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="bg-card border border-border rounded-xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Not Financial Advice</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All content on Stakify is for informational and educational purposes only. Nothing published on this platform constitutes financial, investment, legal, or tax advice. Always conduct your own research and consult a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}