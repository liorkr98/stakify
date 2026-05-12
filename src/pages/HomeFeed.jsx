import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import TrendingPanel from "@/components/feed/TrendingPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { TrendingUp, SlidersHorizontal, X, Flame, Clock, Tag, Eye, AlertCircle, PenLine } from "lucide-react";

const FEED_TABS = [
  { id: "latest",     label: "Latest",     icon: Clock  },
  { id: "trending",   label: "Trending",   icon: Flame  },
  { id: "free",       label: "Free Only",  icon: Tag    },
  { id: "most_viewed",label: "Most Viewed",icon: Eye    },
];

const SECTORS = ["All", "AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Crypto & Web3", "Consumer Tech", "E-Commerce", "Healthcare"];
const MARKET_CAPS = ["All", "Mega", "Large", "Mid", "Small", "Micro"];
const SORT_OPTIONS = ["Latest", "Most Liked", "Premium Only", "Free Only"];

export default function HomeFeed() {
  const [activeTab, setActiveTab]           = useState("latest");
  const [activeSector, setActiveSector]     = useState("All");
  const [activeMarketCap, setActiveMarketCap] = useState("All");
  const [sortBy, setSortBy]                 = useState("Latest");
  const [showFilters, setShowFilters]       = useState(false);
  const [reports, setReports]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const fetchReports = () => {
    setLoading(true);
    setError(null);
    base44.entities.Report.filter({ status: "published" }, "-created_date", 50)
      .then(data => setReports(data || []))
      .catch(() => setError("Failed to load reports. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const tabFiltered = reports
    .filter(r => activeTab === "free" ? !r.is_premium : true)
    .sort((a, b) => {
      if (activeTab === "trending")    return (b.likes || 0) - (a.likes || 0);
      if (activeTab === "most_viewed") return (b.views || b.view_count || 0) - (a.views || a.view_count || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  const filtered = tabFiltered
    .filter(r => activeSector === "All" || r.industry === activeSector)
    .filter(r => activeMarketCap === "All" || (r.market_cap || "").toLowerCase() === activeMarketCap.toLowerCase())
    .filter(r => sortBy === "Premium Only" ? r.is_premium : sortBy === "Free Only" ? !r.is_premium : true)
    .sort((a, b) =>
      sortBy === "Most Liked" ? (b.likes || 0) - (a.likes || 0) :
      sortBy === "Latest"     ? new Date(b.created_date) - new Date(a.created_date) : 0
    );

  const activeFilterCount =
    (activeSector !== "All" ? 1 : 0) +
    (activeMarketCap !== "All" ? 1 : 0) +
    (sortBy !== "Latest" ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">

        {/* ── Main feed ── */}
        <div className="flex-1 min-w-0">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Research Feed</h1>
            <p className="text-sm text-muted-foreground">Verified analyst research, locked predictions, and real track records.</p>
          </div>

          {/* Feed tabs */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {FEED_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground font-medium">
              {loading ? "Loading..." : `${filtered.length} reports`}
            </span>
            <button
              onClick={() => setShowFilters(true)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                activeFilterCount > 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeSector !== "All" && (
                <span className="flex items-center gap-1 text-xs bg-primary/8 text-primary border border-primary/20 rounded-full px-3 py-1 font-medium">
                  {activeSector}
                  <button onClick={() => setActiveSector("All")} className="ml-0.5 hover:text-primary/60"><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeMarketCap !== "All" && (
                <span className="flex items-center gap-1 text-xs bg-primary/8 text-primary border border-primary/20 rounded-full px-3 py-1 font-medium">
                  {activeMarketCap} Cap
                  <button onClick={() => setActiveMarketCap("All")} className="ml-0.5 hover:text-primary/60"><X className="w-3 h-3" /></button>
                </span>
              )}
              {sortBy !== "Latest" && (
                <span className="flex items-center gap-1 text-xs bg-primary/8 text-primary border border-primary/20 rounded-full px-3 py-1 font-medium">
                  {sortBy}
                  <button onClick={() => setSortBy("Latest")} className="ml-0.5 hover:text-primary/60"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Feed content */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-2.5 w-20 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-4/5 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                  <div className="px-5 sm:px-6 py-3 border-t border-border/60 bg-secondary/30 flex gap-5">
                    <Skeleton className="h-3 w-12 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchReports}>Retry</Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-20 text-center">
                <p className="text-sm font-medium text-foreground">No reports match these filters</p>
                <p className="text-xs text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              filtered.map(report => <ReportCard key={report.id} report={report} />)
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <aside className="hidden lg:flex flex-col gap-5 w-72 flex-shrink-0">
          <Leaderboard />
          <TrendingPanel />

          {/* Write CTA */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <PenLine className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Publish Your Research</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Build your analyst brand. Lock predictions, monetize your research, and grow your audience.
            </p>
            <Link to="/editor">
              <Button size="sm" className="w-full text-sm">Start Writing</Button>
            </Link>
          </div>
        </aside>
      </div>

      {/* Filter modal */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base">Filter Reports</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Sector</p>
              <div className="flex flex-wrap gap-1.5">
                {SECTORS.map(s => (
                  <button key={s} onClick={() => setActiveSector(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      activeSector === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Market Cap</p>
              <div className="flex flex-wrap gap-1.5">
                {MARKET_CAPS.map(cap => (
                  <button key={cap} onClick={() => setActiveMarketCap(cap)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      activeMarketCap === cap ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >{cap}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Sort By</p>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      sortBy === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setActiveSector("All"); setActiveMarketCap("All"); setSortBy("Latest"); }}
                className="flex-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl py-2.5 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
