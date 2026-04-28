import React, { useState } from "react";
import { MOCK_REPORTS, MOCK_ANALYSTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Clock, UserPlus, Compass, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const INDUSTRIES = ["AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Consumer Tech", "Crypto & Web3", "E-Commerce", "Healthcare", "Options Flow"];
const MARKET_CAPS = [
  { key: "mega", label: "Mega Cap" },
  { key: "large", label: "Large Cap" },
  { key: "mid", label: "Mid Cap" },
  { key: "small", label: "Small Cap" },
  { key: "micro", label: "Micro Cap" },
];

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("trending");
  const [following, setFollowing] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState(null);
  const [filterCap, setFilterCap] = useState(null);
  const navigate = useNavigate();

  const toggleFollow = (analystId) => {
    setFollowing((prev) => ({ ...prev, [analystId]: !prev[analystId] }));
  };

  const TABS = [
    { key: "trending", label: "Trending", icon: Flame },
    { key: "latest", label: "Latest", icon: Clock },
    { key: "discover", label: "Discover", icon: Compass },
  ];

  const applyFilters = (list) => list.filter(r =>
    (!filterIndustry || r.industry === filterIndustry) &&
    (!filterCap || r.marketCap === filterCap)
  );

  const trendingReports = applyFilters([...MOCK_REPORTS].sort((a, b) => b.likes - a.likes));
  const latestReports = applyFilters([...MOCK_REPORTS].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
  const discoverReports = applyFilters(MOCK_REPORTS.filter(r => !r.isPremium));
  const hasFilters = filterIndustry || filterCap;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Research <span className="text-primary">Feed</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Follow analysts and track their publicly locked predictions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Feed Tabs */}
          <div className="flex items-center gap-1 mb-3 border-b border-border/40 pb-3 flex-wrap">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showFilters || hasFilters ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-5 p-4 bg-secondary/40 border border-border/60 rounded-xl space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Industry</p>
                <div className="flex flex-wrap gap-1.5">
                  {INDUSTRIES.map((ind) => (
                    <button key={ind} onClick={() => setFilterIndustry(filterIndustry === ind ? null : ind)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filterIndustry === ind ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Market Cap</p>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_CAPS.map((cap) => (
                    <button key={cap.key} onClick={() => setFilterCap(filterCap === cap.key ? null : cap.key)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filterCap === cap.key ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {cap.label}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={() => { setFilterIndustry(null); setFilterCap(null); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          )}


          {/* Reports */}
          {activeTab !== "discover" ? (
            <div className="space-y-4">
              {(activeTab === "trending" ? trendingReports : latestReports).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">Free to read · All topics</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {discoverReports.map((report) => (
                  <ReportCard key={report.id} report={report} compact />
                ))}
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Compass className="w-4 h-4 text-primary" /> Browse by Specialty</h3>
                <div className="flex flex-wrap gap-2">
                  {["AI & Semiconductors","Big Tech","EV & Clean Energy","Macro","Consumer Tech","Financials","Crypto & Web3","Healthcare","Options Flow"].map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors text-xs py-1 px-3">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <Leaderboard />

          {/* Suggested Analysts */}
          <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40">
              <h3 className="font-bold text-sm">Suggested Analysts</h3>
            </div>
            <div className="divide-y divide-border/30">
              {MOCK_ANALYSTS.slice(0, 3).map((analyst) => (
                <div key={analyst.id} className="px-5 py-3 flex items-center gap-3">
                  <button onClick={() => navigate(`/analyst?id=${analyst.id}`)}>
                    <img
                      src={analyst.avatar}
                      alt={analyst.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-border hover:ring-primary/40 transition-all"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigate(`/analyst?id=${analyst.id}`)} className="text-sm font-semibold truncate hover:text-primary transition-colors block text-left">{analyst.name}</button>
                    <p className="text-xs text-muted-foreground">
                      {analyst.followers.toLocaleString()} followers
                    </p>
                  </div>
                  <Button
                    variant={following[analyst.id] ? "secondary" : "outline"}
                    size="sm"
                    className={`text-xs h-7 ${
                      following[analyst.id]
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "border-border hover:border-primary/30 hover:text-primary"
                    }`}
                    onClick={() => toggleFollow(analyst.id)}
                  >
                    {following[analyst.id] ? (
                      "Following"
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Market Summary */}
          <div className="bg-card border border-border/60 rounded-xl p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Market Pulse
            </h3>
            <div className="space-y-2">
              {[
                { label: "S&P 500", value: "5,234.18", change: "+0.85%" },
                { label: "NASDAQ", value: "16,742.39", change: "+1.12%" },
                { label: "BTC/USD", value: "68,432.50", change: "-0.45%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground">{item.value}</span>
                    <span
                      className={`font-mono text-xs ${
                        item.change.startsWith("+") ? "text-gain" : "text-loss"
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}