import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Target, Zap, Users, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const urlParams = () => new URLSearchParams(window.location.search);

const ACCURACY_DATA = [
  { month: "Nov", value: 72 }, { month: "Dec", value: 78 }, { month: "Jan", value: 80 },
  { month: "Feb", value: 83 }, { month: "Mar", value: 85 }, { month: "Apr", value: 87.5 },
];
const POINTS_DATA = [
  { month: "Nov", value: 6200 }, { month: "Dec", value: 6900 }, { month: "Jan", value: 7300 },
  { month: "Feb", value: 7800 }, { month: "Mar", value: 8200 }, { month: "Apr", value: 8750 },
];
const YIELD_DATA = [
  { month: "Nov", value: 18 }, { month: "Dec", value: 21 }, { month: "Jan", value: 25 },
  { month: "Feb", value: 28 }, { month: "Mar", value: 31 }, { month: "Apr", value: 34.2 },
];
const FOLLOWERS_DATA = [
  { month: "Nov", value: 8400 }, { month: "Dec", value: 9100 }, { month: "Jan", value: 10200 },
  { month: "Feb", value: 10900 }, { month: "Mar", value: 11700 }, { month: "Apr", value: 12400 },
];

const PREDICTION_BREAKDOWN = [
  { label: "Exact Hits", count: 22, color: "#22c55e" },
  { label: "Near Hits", count: 11, color: "#84cc16" },
  { label: "Directional", count: 6, color: "#eab308" },
  { label: "Misses", count: 6, color: "#ef4444" },
];

const CONFIGS = {
  accuracy: { title: "Accuracy Score", icon: Target, value: "87.5%", color: "#22c55e", data: ACCURACY_DATA, unit: "%" },
  points: { title: "Total Points", icon: Zap, value: "8,750", color: "#f59e0b", data: POINTS_DATA, unit: " pts" },
  yield: { title: "Yearly Yield", icon: TrendingUp, value: "+34.2%", color: "#10b981", data: YIELD_DATA, unit: "%" },
  followers: { title: "Followers", icon: Users, value: "12,400", color: "#3b82f6", data: FOLLOWERS_DATA, unit: "" },
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const category = urlParams().get("category") || "accuracy";
  const config = CONFIGS[category] || CONFIGS.accuracy;
  const Icon = config.icon;

  const chartColor = config.color;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${chartColor}18`, border: `1px solid ${chartColor}30` }}>
          <Icon className="w-5 h-5" style={{ color: chartColor }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{config.title} Analytics</h1>
          <p className="text-sm text-muted-foreground">Current: <span className="font-bold text-foreground">{config.value}</span></p>
        </div>
      </div>

      {/* Switch category */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(CONFIGS).map(([key, cfg]) => {
          const CIcon = cfg.icon;
          return (
            <button key={key} onClick={() => navigate(`/analytics?category=${key}`)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${category === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
              <CIcon className="w-3.5 h-3.5" />
              {cfg.title}
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">6-Month Trend</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={config.data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${config.unit.replace(" pts", "K")}`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(v) => [`${v}${config.unit}`, config.title]}
              />
              <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} fill="url(#colorVal)" dot={{ fill: chartColor, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {category === "accuracy" && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Prediction Breakdown</h3>
            <div className="space-y-3">
              {PREDICTION_BREAKDOWN.map((p) => (
                <div key={p.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <span className="text-sm flex-1">{p.label}</span>
                  <span className="text-sm font-bold">{p.count}</span>
                  <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(p.count / 45) * 100}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Accuracy by Sector</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { sector: "AI/ML", acc: 92 }, { sector: "SaaS", acc: 85 }, { sector: "Macro", acc: 79 }, { sector: "Crypto", acc: 71 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="sector" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`, "Accuracy"]} />
                  <Bar dataKey="acc" fill={chartColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {category === "followers" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Top Report Performance</h3>
          <div className="space-y-3">
            {[
              { title: "NVIDIA: The AI Backbone Play", followers: "+840", likes: 342 },
              { title: "AMD vs NVIDIA: The Underdog Catches Up", followers: "+420", likes: 201 },
            ].map((r) => (
              <div key={r.title} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <p className="text-sm font-medium flex-1 min-w-0 truncate mr-4">{r.title}</p>
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <span className="flex items-center gap-1 text-green-600 font-semibold"><ArrowUp className="w-3 h-3" />{r.followers} followers</span>
                  <span className="text-muted-foreground">{r.likes} likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}