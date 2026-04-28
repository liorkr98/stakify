import React, { useState } from "react";
import { Eye, ShoppingCart, TrendingUp, TrendingDown, ArrowUpRight, Users, DollarSign, MousePointerClick } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const PERIODS = ["7D", "30D", "90D"];

const VIEW_DATA = {
  "7D": [
    { day: "Mon", views: 820, purchases: 4 },
    { day: "Tue", views: 1140, purchases: 7 },
    { day: "Wed", views: 940, purchases: 5 },
    { day: "Thu", views: 1380, purchases: 11 },
    { day: "Fri", views: 1820, purchases: 14 },
    { day: "Sat", views: 2240, purchases: 18 },
    { day: "Sun", views: 1650, purchases: 9 },
  ],
  "30D": [
    { day: "W1", views: 5200, purchases: 32 },
    { day: "W2", views: 6800, purchases: 41 },
    { day: "W3", views: 7400, purchases: 55 },
    { day: "W4", views: 9100, purchases: 68 },
  ],
  "90D": [
    { day: "Jan", views: 18000, purchases: 98 },
    { day: "Feb", views: 24000, purchases: 142 },
    { day: "Mar", views: 31000, purchases: 189 },
  ],
};

const TOP_REPORTS = [
  { title: "NVIDIA: The AI Backbone Play for 2026", views: 4820, purchases: 38, revenue: 189.62 },
  { title: "AMD vs NVIDIA: The Underdog Catches Up", views: 3140, purchases: 22, revenue: 109.78 },
  { title: "ARM Holdings: The Royalty on Every AI Chip", views: 2280, purchases: 14, revenue: 83.86 },
];

const TRAFFIC_SOURCES = [
  { label: "Direct / Feed", pct: 42, color: "bg-primary" },
  { label: "Search", pct: 28, color: "bg-blue-500" },
  { label: "Social Media", pct: 18, color: "bg-purple-500" },
  { label: "Referral", pct: 12, color: "bg-amber-500" },
];

export default function InsightsPanel() {
  const [period, setPeriod] = useState("7D");
  const data = VIEW_DATA[period];

  const totalViews = data.reduce((s, d) => s + d.views, 0);
  const totalPurchases = data.reduce((s, d) => s + d.purchases, 0);
  const totalRevenue = (totalPurchases * 4.99).toFixed(2);
  const conversionRate = ((totalPurchases / totalViews) * 100).toFixed(2);

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Insights
        </h2>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                period === p ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Page Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-600", trend: "+18%", up: true },
          { label: "Purchases", value: totalPurchases, icon: ShoppingCart, color: "text-green-600", trend: "+24%", up: true },
          { label: "Revenue", value: `$${totalRevenue}`, icon: DollarSign, color: "text-primary", trend: "+24%", up: true },
          { label: "Conversion", value: `${conversionRate}%`, icon: MousePointerClick, color: "text-purple-600", trend: "+0.3%", up: true },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-secondary/50 rounded-xl p-3 border border-border/40">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${kpi.color}`} />
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Views & Purchases Over Time</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e5e7eb" }} />
              <Area yAxisId="left" type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#gViews)" dot={false} name="Views" />
              <Bar yAxisId="right" dataKey="purchases" fill="#22c55e" radius={[3, 3, 0, 0]} name="Purchases" barSize={8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top reports */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Performing Reports</p>
        <div className="space-y-2">
          {TOP_REPORTS.map((r, i) => (
            <div key={r.title} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
              <span className="text-xs font-bold text-muted-foreground w-4 flex-shrink-0">#{i + 1}</span>
              <p className="text-sm font-medium flex-1 min-w-0 truncate">{r.title}</p>
              <div className="flex items-center gap-4 text-xs flex-shrink-0">
                <span className="flex items-center gap-1 text-muted-foreground"><Eye className="w-3 h-3" />{r.views.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold"><ShoppingCart className="w-3 h-3" />{r.purchases}</span>
                <span className="font-bold text-primary">${r.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic sources */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Traffic Sources</p>
        <div className="space-y-2">
          {TRAFFIC_SOURCES.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-32 flex-shrink-0">{s.label}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
              </div>
              <span className="text-xs font-semibold w-8 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}