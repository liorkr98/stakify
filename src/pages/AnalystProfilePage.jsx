import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Twitter, Globe, Linkedin, UserPlus, MessageCircle, BarChart3, FileText, Star, Target, Award, Users, Flame, Trophy, BookOpen, Rocket, Shield, CheckCircle, Clock, Zap, X, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";

const PROFILE_KEY = "stakify_profile";

const ACCURACY_BREAKDOWN = [
  { sector: "AI & Semiconductors", accuracy: 91, calls: 24 },
  { sector: "Big Tech", accuracy: 85, calls: 18 },
  { sector: "EV & Clean Energy", accuracy: 78, calls: 9 },
  { sector: "Financials", accuracy: 72, calls: 7 },
  { sector: "Crypto & Web3", accuracy: 65, calls: 5 },
];

const YIELD_HISTORY = [
  { period: "Q1 2025", yield: 8.2, benchmark: 3.1 },
  { period: "Q2 2025", yield: 6.7, benchmark: 2.4 },
  { period: "Q3 2025", yield: 11.4, benchmark: 4.8 },
  { period: "Q4 2025", yield: 7.9, benchmark: 1.9 },
];

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true },
  { label: "10 Predictions", icon: Target, earned: true },
  { label: "80%+ Accuracy", icon: Award, earned: true },
  { label: "100 Followers", icon: Users, earned: true },
  { label: "500 Followers", icon: Users, earned: true },
  { label: "First Premium", icon: Star, earned: true },
  { label: "Streak x3", icon: Flame, earned: true },
  { label: "Top 10", icon: Trophy, earned: false },
  { label: "1K Likes", icon: CheckCircle, earned: false },
  { label: "50 Reports", icon: BookOpen, earned: false },
  { label: "90%+ Accuracy", icon: Shield, earned: false },
  { label: "Streak x10", icon: Rocket, earned: false },
];

export default function AnalystProfilePage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const analystId = urlParams.get("id") || "a2";

  const baseAnalyst = MOCK_ANALYSTS.find((a) => a.id === analystId) || MOCK_ANALYSTS[1];
  // If viewing own profile (a1), merge saved edits
  const saved = (() => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } })();
  const analyst = analystId === "a1" ? { ...baseAnalyst, ...saved } : baseAnalyst;

  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);

  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [statsModal, setStatsModal] = useState(null); // "accuracy" | "yield"

  const socialLinks = {
    twitter: saved.twitter || (analyst.id === "a2" ? "@marcuswebb" : null),
    linkedin: saved.linkedin || (analyst.id === "a2" ? "marcuswebb" : null),
    website: saved.website || null,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <img
              src={analyst.avatar}
              alt={analyst.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-card"
            />
            <div className="flex gap-2">
              <Button
                variant={subscribed ? "secondary" : "default"}
                size="sm"
                className={subscribed ? "bg-primary/10 text-primary border border-primary/30" : "bg-primary text-white"}
                onClick={() => setSubscribed(!subscribed)}
              >
                <Star className="w-3.5 h-3.5 mr-1.5" />
                {subscribed ? "Subscribed" : "Subscribe $9/mo"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={following ? "border-primary/30 text-primary bg-primary/5" : ""}
                onClick={() => setFollowing(!following)}
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                {following ? "Following" : "Follow"}
              </Button>
              {subscribed && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/dm?analyst=${analyst.id}`)}>
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Message
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">{analyst.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{analyst.bio}</p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(analyst.specialties || []).map((s) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 flex-wrap text-sm">
            {socialLinks.twitter && (
              <a
                href={`https://twitter.com/${socialLinks.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sky-500 hover:text-sky-600 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                {socialLinks.twitter}
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                {socialLinks.linkedin}
              </a>
            )}
            {socialLinks.website && (
              <a
                href={`https://${socialLinks.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {socialLinks.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Accuracy", value: `${analyst.accuracy}%`, icon: BarChart3, color: "text-primary", modal: "accuracy" },
          { label: "Yearly Yield", value: `+${analyst.yearlyYield || 34.2}%`, icon: TrendingUp, color: "text-amber-500", modal: "yield" },
          { label: "Followers", value: analyst.followers.toLocaleString(), icon: UserPlus, color: "text-blue-500", modal: null },
          { label: "Reports", value: analyst.reports, icon: FileText, color: "text-muted-foreground", modal: null },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => stat.modal && setStatsModal(stat.modal)}
              className={`bg-card border border-border rounded-xl p-4 text-center transition-all ${stat.modal ? "hover:border-primary/40 hover:shadow-sm cursor-pointer" : "cursor-default"}`}
            >
              <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.modal && <p className="text-[10px] text-primary mt-1">Tap to see breakdown →</p>}
            </button>
          );
        })}
      </div>

      {/* Stats Modal */}
      {statsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setStatsModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">
                {statsModal === "accuracy" ? "Accuracy Breakdown" : "Yearly Yield History"}
              </h2>
              <button onClick={() => setStatsModal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statsModal === "accuracy" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">How {analyst.name.split(" ")[0]}'s predictions performed across sectors</p>
                {ACCURACY_BREAKDOWN.map((row) => (
                  <div key={row.sector}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{row.sector}</span>
                      <span className="font-bold text-primary">{row.accuracy}% <span className="text-xs font-normal text-muted-foreground">({row.calls} calls)</span></span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.accuracy}%` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall accuracy</span>
                  <span className="font-bold text-primary">{analyst.accuracy}%</span>
                </div>
              </div>
            )}

            {statsModal === "yield" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Quarterly returns vs S&P 500 benchmark</p>
                {YIELD_HISTORY.map((row) => (
                  <div key={row.period} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20 flex-shrink-0">{row.period}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(row.yield / 15) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold text-amber-600 w-12 text-right">+{row.yield}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">S&P: +{row.benchmark}%</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">Full year yield</span>
                  <span className="font-bold text-amber-600">+{analyst.yearlyYield || 34.2}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-card border border-border/60 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Achievements
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned
          </span>
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.label} title={a.label}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${a.earned ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-border/30 opacity-40"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${a.earned ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`w-3.5 h-3.5 ${a.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="text-[9px] font-medium leading-tight">{a.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports */}
      <div>
        <h2 className="text-lg font-bold mb-4">Published Reports</h2>
        {myReports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No published reports yet.</p>
        ) : (
          <div className="space-y-4">
            {myReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}