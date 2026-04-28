import React, { useState } from "react";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target, TrendingUp, Award, FileText, Star, Flame,
  Trophy, Users, Zap, ArrowUp, ArrowDown, Minus,
  BookOpen, Rocket, Shield, CheckCircle, Clock, BarChart3,
  Megaphone, ChevronRight, MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import PredictionBadge from "@/components/feed/PredictionBadge";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TwitsPanel from "@/components/dashboard/TwitsPanel";
import { useNavigate, Link } from "react-router-dom";

const STAT_CARDS = [
  { key: "accuracy", label: "Accuracy Score", value: "87.5%", icon: Target, color: "text-green-600", bg: "bg-green-50 border-green-200", sub: "+2.3% vs last quarter" },
  { key: "points", label: "Total Points", value: "8,750", icon: Zap, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", sub: "Top 3% of analysts" },
  { key: "yield", label: "Yearly Yield", value: "+34.2%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10 border-primary/20", sub: "vs S&P 500: +12.1%" },
  { key: "followers", label: "Followers", value: "12,400", icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", sub: "+340 this month" },
];

const ACTION_ICONS = { Long: ArrowUp, Short: ArrowDown, Hold: Minus };
const ACTION_COLORS = {
  Long: "bg-green-50 text-green-700 border-green-200",
  Short: "bg-red-50 text-red-700 border-red-200",
  Hold: "bg-amber-50 text-amber-700 border-amber-200",
};

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true, desc: "Published your first report" },
  { label: "10 Predictions", icon: Target, earned: true, desc: "Made 10 locked predictions" },
  { label: "80%+ Accuracy", icon: Award, earned: true, desc: "Hit 80% accuracy score" },
  { label: "100 Followers", icon: Users, earned: true, desc: "Reached 100 followers" },
  { label: "500 Followers", icon: Users, earned: true, desc: "Reached 500 followers" },
  { label: "First Premium Report", icon: Star, earned: true, desc: "Sold your first premium report" },
  { label: "Streak x3", icon: Flame, earned: true, desc: "3 correct predictions in a row" },
  { label: "Top 10 Analyst", icon: Trophy, earned: false, desc: "Rank in global top 10" },
  { label: "1,000 Likes", icon: CheckCircle, earned: false, desc: "Get 1,000 total likes across reports" },
  { label: "50 Reports", icon: BookOpen, earned: false, desc: "Publish 50 research reports" },
  { label: "90%+ Accuracy", icon: Shield, earned: false, desc: "Hit 90% accuracy score" },
  { label: "Streak x10", icon: Rocket, earned: false, desc: "10 correct predictions in a row" },
  { label: "10K Followers", icon: Users, earned: false, desc: "Reach 10,000 followers" },
  { label: "Verified Expert", icon: Award, earned: false, desc: "Manually verified by Stakify team" },
  { label: "1-Year Active", icon: Clock, earned: false, desc: "Active analyst for 1 full year" },
  { label: "Market Caller", icon: BarChart3, earned: false, desc: "Correct on 5 sector-level macro calls" },
];

const PROMOTE_PACKAGES = [
  { label: "Boost", price: 19, desc: "Featured in feed for 24h", icon: "🚀" },
  { label: "Spotlight", price: 49, desc: "Homepage feature for 3 days", icon: "⭐" },
  { label: "Campaign", price: 149, desc: "7-day promotion + email blast", icon: "📣" },
];

export default function AnalystDashboard() {
  const [tab, setTab] = useState("published");
  const [promoteReport, setPromoteReport] = useState(null);
  const navigate = useNavigate();
  const analyst = MOCK_ANALYSTS[0];

  const drafts = [
    { id: "d1", title: "Amazon's Healthcare Pivot: Underappreciated Opportunity", updatedAt: "2026-04-14" },
    { id: "d2", title: "Semiconductor Supply Chain Deep Dive", updatedAt: "2026-04-13" },
  ];

  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img src={analyst.avatar} alt={analyst.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{analyst.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Senior Equity Research Analyst · Specializing in Tech & AI · Based in San Francisco
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">{analyst.reports}</span> Reports</span>
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">{analyst.followers.toLocaleString()}</span> Followers</span>
              <span className="text-muted-foreground">Joined <span className="text-foreground">Jan 2025</span></span>
            </div>
          </div>
          <Link to="/edit-profile">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid — clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => navigate(`/analytics?category=${stat.key}`)}
              className={`rounded-xl border p-4 text-left hover:shadow-md transition-all group ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Insights */}
      <InsightsPanel />

      {/* Two-column layout: left = content, right = twits */}
      <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">

      {/* Achievements */}
      <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length} earned
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                title={a.desc}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center cursor-default transition-all ${
                  a.earned ? "bg-primary/5 border-primary/20 hover:bg-primary/10" : "bg-muted/30 border-border/30 opacity-40"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${a.earned ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`w-4 h-4 ${a.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="text-[10px] font-medium leading-tight">{a.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promote Reports */}
      <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Promote a Report
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Boost visibility with paid promotion on the Stakify platform.</p>

        {/* Report selector */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select Report</p>
          <div className="flex flex-wrap gap-2">
            {myReports.map((r) => (
              <button
                key={r.id}
                onClick={() => setPromoteReport(r.id === promoteReport ? null : r.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${promoteReport === r.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}
              >
                {r.title.length > 40 ? r.title.slice(0, 40) + "..." : r.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {PROMOTE_PACKAGES.map((pkg) => (
            <button
              key={pkg.label}
              onClick={() => navigate(`/pay?mode=promote&report=${promoteReport || "r1"}&package=${pkg.label.toLowerCase()}`)}
              className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
            >
              <span className="text-2xl">{pkg.icon}</span>
              <div>
                <p className="font-bold text-sm">{pkg.label}</p>
                <p className="text-xs text-muted-foreground">{pkg.desc}</p>
              </div>
              <p className="font-bold text-primary mt-auto">${pkg.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reports + Subscriptions + Purchases */}
      <div>
        <Tabs value={tab} onValueChange={setTab} className="mb-5">
          <TabsList className="bg-secondary flex-wrap h-auto">
            <TabsTrigger value="published">Published ({myReports.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscribed</TabsTrigger>
            <TabsTrigger value="purchases">Purchased</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "published" ? (
          <div className="space-y-4">
            {myReports.map((report) => (
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
        ) : tab === "drafts" ? (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-card border border-border/60 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{draft.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last edited {format(new Date(draft.updatedAt), "MMM d, yyyy")}</p>
                </div>
                <Badge variant="outline" className="text-muted-foreground border-border">Draft</Badge>
              </div>
            ))}
          </div>
        ) : tab === "subscriptions" ? (
          <div className="space-y-3">
            {MOCK_ANALYSTS.slice(1, 4).map((a) => (
              <div key={a.id} className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4">
                <button onClick={() => navigate(`/analyst?id=${a.id}`)}>
                  <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-border hover:ring-primary/50 transition-all" />
                </button>
                <div className="flex-1 min-w-0">
                  <button onClick={() => navigate(`/analyst?id=${a.id}`)} className="font-semibold hover:text-primary transition-colors">{a.name}</button>
                  <p className="text-xs text-muted-foreground">{a.followers.toLocaleString()} followers · {a.accuracy}% accuracy</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(a.specialties || []).slice(0, 2).map((s) => <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/dm?analyst=${a.id}`)}>
                    <MessageCircle className="w-3 h-3 mr-1" /> DM
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/analyst?id=${a.id}`)}>View</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_REPORTS.filter(r => r.isPremium).slice(0, 4).map((report) => (
              <div key={report.id} className="bg-card border border-border/60 rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:border-border transition-colors"
                onClick={() => navigate(`/report?id=${report.id}&paid=true`)}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{report.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">by {report.author.name} · ${report.price}</p>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">Purchased</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>{/* end left col */}

      {/* Right column: Twits */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <TwitsPanel />
      </div>

      </div>{/* end two-col */}
    </div>
  );
}