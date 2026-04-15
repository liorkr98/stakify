import React, { useState } from "react";
import { MOCK_REPORTS, MOCK_ANALYSTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, Clock, UserPlus } from "lucide-react";

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("trending");
  const [following, setFollowing] = useState({});

  const toggleFollow = (analystId) => {
    setFollowing((prev) => ({ ...prev, [analystId]: !prev[analystId] }));
  };

  const TABS = [
    { key: "trending", label: "Trending", icon: Flame },
    { key: "latest", label: "Latest", icon: Clock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Research <span className="text-primary">Feed</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Follow top analysts and track their verified predictions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Feed Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border/40 pb-3">
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
          </div>

          {/* Reports */}
          <div className="space-y-4">
            {MOCK_REPORTS.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
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
                  <img
                    src={analyst.avatar}
                    alt={analyst.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{analyst.name}</p>
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