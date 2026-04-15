import React, { useState } from "react";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target, TrendingUp, Award, FileText, Star,
  Trophy, Users, Zap, ArrowUp, ArrowDown, Minus
} from "lucide-react";
import { format } from "date-fns";
import PredictionBadge from "@/components/feed/PredictionBadge";

const STAT_CARDS = [
  {
    label: "Accuracy Score",
    value: "87.5%",
    icon: Target,
    color: "text-gain",
    bg: "bg-gain/10 border-gain/20",
    sub: "+2.3% vs last quarter",
  },
  {
    label: "Total Points",
    value: "8,750",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
    sub: "Top 3% of analysts",
  },
  {
    label: "Yearly Yield",
    value: "+34.2%",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    sub: "vs S&P 500: +12.1%",
  },
  {
    label: "Followers",
    value: "12,400",
    icon: Users,
    color: "text-chart-4",
    bg: "bg-blue-500/10 border-blue-500/20",
    sub: "+340 this month",
  },
];

const ACTION_ICONS = { Long: ArrowUp, Short: ArrowDown, Hold: Minus };
const ACTION_COLORS = {
  Long: "bg-gain/10 text-gain border-gain/20",
  Short: "bg-loss/10 text-loss border-loss/20",
  Hold: "bg-accent/10 text-accent border-accent/20",
};

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true },
  { label: "10 Predictions", icon: Target, earned: true },
  { label: "80%+ Accuracy", icon: Award, earned: true },
  { label: "100 Followers", icon: Users, earned: true },
  { label: "Top 10 Analyst", icon: Trophy, earned: false },
  { label: "Streak Master", icon: Star, earned: false },
];

export default function AnalystDashboard() {
  const [tab, setTab] = useState("published");
  const analyst = MOCK_ANALYSTS[0]; // Current user's analyst profile

  const drafts = [
    { id: "d1", title: "Amazon's Healthcare Pivot: Underappreciated Opportunity", updatedAt: "2026-04-14" },
    { id: "d2", title: "Semiconductor Supply Chain Deep Dive", updatedAt: "2026-04-13" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={analyst.avatar}
            alt={analyst.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{analyst.name}</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Verified Analyst
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Senior Equity Research Analyst · Specializing in Tech & AI · Based in San Francisco
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{analyst.reports}</span> Reports
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{analyst.followers.toLocaleString()}</span> Followers
              </span>
              <span className="text-muted-foreground">
                Joined <span className="text-foreground">Jan 2025</span>
              </span>
            </div>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Gamification / Achievements */}
      <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center ${
                  a.earned
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-border/30 opacity-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    a.earned ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${a.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="text-[11px] font-medium">{a.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports */}
      <div>
        <Tabs value={tab} onValueChange={setTab} className="mb-5">
          <TabsList className="bg-secondary">
            <TabsTrigger value="published">Published ({MOCK_REPORTS.filter(r => r.author.id === analyst.id).length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "published" ? (
          <div className="space-y-4">
            {MOCK_REPORTS.filter(r => r.author.id === analyst.id).map((report) => (
              <div key={report.id} className="bg-card border border-border/60 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{report.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Published {format(new Date(report.publishedAt), "MMM d, yyyy")} · {report.likes} likes
                    </p>
                  </div>
                  <Badge className={ACTION_COLORS[report.prediction.action]}>
                    {React.createElement(ACTION_ICONS[report.prediction.action], { className: "w-3 h-3 mr-1" })}
                    {report.prediction.action}
                  </Badge>
                </div>
                <PredictionBadge prediction={report.prediction} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-card border border-border/60 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{draft.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last edited {format(new Date(draft.updatedAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="outline" className="text-muted-foreground border-border">
                  Draft
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}