import React, { useState } from "react";
import { MOCK_REPORTS, MOCK_ANALYSTS } from "@/lib/mockData";
import { Target, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, parseISO, addMonths } from "date-fns";
import { useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const PROFILE_KEY = "stakify_profile";

// Compute prediction outcome from mock data
function getPredictionOutcome(report) {
  const { prediction } = report;
  if (!prediction) return null;

  const lockPrice = prediction.lockPrice;
  const targetPrice = prediction.targetPrice;
  const action = prediction.action;
  const lockTime = parseISO(prediction.lockTime);

  // Parse timeframe months
  const months = parseInt(prediction.timeframe) || 6;
  const expiryDate = addMonths(lockTime, months);
  const now = new Date();

  if (expiryDate > now) {
    return { status: "pending", label: "In Progress", daysLeft: differenceInDays(expiryDate, now) };
  }

  // Simulate a current price by seeding from report id
  const seed = report.id.charCodeAt(report.id.length - 1);
  const randomFactor = 0.85 + (seed % 30) / 100;
  const currentPrice = lockPrice * randomFactor + (targetPrice - lockPrice) * 0.6;

  const priceDiff = action === "Short"
    ? (lockPrice - currentPrice) / lockPrice
    : (currentPrice - lockPrice) / lockPrice;

  const targetDiff = action === "Short"
    ? (lockPrice - targetPrice) / lockPrice
    : (targetPrice - lockPrice) / lockPrice;

  const achievedRatio = targetDiff > 0 ? priceDiff / targetDiff : 0;

  if (achievedRatio >= 0.85) return { status: "hit", label: "Exact Hit", credit: 1.0, currentPrice };
  if (achievedRatio >= 0.5) return { status: "near", label: "Near Hit", credit: 0.5, currentPrice };
  if (achievedRatio >= 0.15) return { status: "partial", label: "Directional", credit: 0.25, currentPrice };
  return { status: "miss", label: "Miss", credit: 0, currentPrice };
}

const STATUS_CONFIG = {
  hit:     { color: "text-gain", bg: "bg-gain/10 border-gain/30", icon: CheckCircle2 },
  near:    { color: "text-primary", bg: "bg-primary/10 border-primary/30", icon: CheckCircle2 },
  partial: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: TrendingUp },
  miss:    { color: "text-loss", bg: "bg-loss/10 border-loss/30", icon: XCircle },
  pending: { color: "text-muted-foreground", bg: "bg-secondary border-border", icon: Clock },
};

const ACTION_CONFIG = {
  Long:  { icon: TrendingUp, color: "text-gain" },
  Short: { icon: TrendingDown, color: "text-loss" },
  Hold:  { icon: Minus, color: "text-amber-500" },
};

const PIE_COLORS = ["hsl(152,55%,38%)", "hsl(152,55%,55%)", "hsl(35,90%,50%)", "hsl(0,72%,52%)", "hsl(215,20%,65%)"];

export default function PredictionSummaryPage() {
  const navigate = useNavigate();
  const saved = (() => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } })();
  const baseAnalyst = MOCK_ANALYSTS[0];
  const analyst = { ...baseAnalyst, ...saved };

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

  // Only show reports for the logged-in analyst (a1)
  const myReports = MOCK_REPORTS.filter((r) => r.author.id === "a1");
  const predictions = myReports.map((r) => ({ ...r, outcome: getPredictionOutcome(r) }));

  // Stats
  const completed = predictions.filter((p) => p.outcome && p.outcome.status !== "pending");
  const hits = completed.filter((p) => p.outcome.status === "hit").length;
  const near = completed.filter((p) => p.outcome.status === "near").length;
  const partial = completed.filter((p) => p.outcome.status === "partial").length;
  const misses = completed.filter((p) => p.outcome.status === "miss").length;
  const pending = predictions.filter((p) => p.outcome?.status === "pending").length;
  const totalCredit = completed.reduce((sum, p) => sum + (p.outcome.credit || 0), 0);
  const accuracy = completed.length > 0 ? ((totalCredit / completed.length) * 100).toFixed(1) : 0;

  const pieData = [
    { name: "Exact Hit", value: hits },
    { name: "Near Hit", value: near },
    { name: "Directional", value: partial },
    { name: "Miss", value: misses },
    { name: "Pending", value: pending },
  ].filter((d) => d.value > 0);

  const filtered = predictions.filter((p) => {
    const matchStatus = filterStatus === "all" || p.outcome?.status === filterStatus;
    const matchAction = filterAction === "all" || p.prediction?.action === filterAction;
    return matchStatus && matchAction;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <img src={analyst.avatar} alt={analyst.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20" />
          <div>
            <h1 className="text-2xl font-bold">Prediction Summary</h1>
            <p className="text-sm text-muted-foreground">{analyst.name} · All locked predictions</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Accuracy Score", value: `${accuracy}%`, sub: `${completed.length} resolved`, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
          { label: "Exact Hits", value: hits, sub: "100% credit each", color: "text-gain", bg: "bg-gain/10 border-gain/20" },
          { label: "Misses", value: misses, sub: "−20 pts each", color: "text-loss", bg: "bg-loss/10 border-loss/20" },
          { label: "In Progress", value: pending, sub: "awaiting expiry", color: "text-muted-foreground", bg: "bg-secondary border-border" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Breakdown */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Pie chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="font-semibold text-sm mb-4">Outcome Distribution</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-bold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Credit breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="font-semibold text-sm mb-4">Credit Breakdown</p>
          <div className="space-y-3">
            {[
              { label: "Exact Hits", count: hits, credit: "×1.0", pts: hits * 100, color: "bg-gain" },
              { label: "Near Hits", count: near, credit: "×0.5", pts: near * 50, color: "bg-primary" },
              { label: "Directional", count: partial, credit: "×0.25", pts: partial * 25, color: "bg-amber-500" },
              { label: "Misses", count: misses, credit: "×0", pts: misses * -20, color: "bg-loss" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.color}`} />
                <span className="flex-1 text-muted-foreground">{row.label} ({row.count})</span>
                <span className="text-xs text-muted-foreground">{row.credit}</span>
                <span className={`font-bold w-16 text-right ${row.pts < 0 ? "text-loss" : "text-foreground"}`}>
                  {row.pts > 0 ? "+" : ""}{row.pts} pts
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between text-sm font-bold">
              <span>Total Points Earned</span>
              <span className="text-primary">+{hits * 100 + near * 50 + partial * 25} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["all", "hit", "near", "partial", "miss", "pending"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${filterStatus === s ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
            {s === "all" ? "All Outcomes" : s === "hit" ? "Exact Hit" : s === "near" ? "Near Hit" : s === "partial" ? "Directional" : s === "miss" ? "Miss" : "In Progress"}
          </button>
        ))}
        <div className="w-px h-4 bg-border mx-1" />
        {["all", "Long", "Short", "Hold"].map((a) => (
          <button key={a} onClick={() => setFilterAction(a)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filterAction === a ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
            {a === "all" ? "All Actions" : a}
          </button>
        ))}
      </div>

      {/* Prediction Table */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const outcome = report.outcome;
          if (!outcome) return null;
          const statusCfg = STATUS_CONFIG[outcome.status];
          const actionCfg = ACTION_CONFIG[report.prediction.action];
          const StatusIcon = statusCfg.icon;
          const ActionIcon = actionCfg.icon;

          return (
            <div key={report.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-all cursor-pointer"
              onClick={() => navigate(`/report?id=${report.id}`)}>
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug mb-1">{report.title}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="font-mono font-bold text-foreground">${report.prediction.ticker}</span>
                    <span className={`flex items-center gap-0.5 font-semibold ${actionCfg.color}`}>
                      <ActionIcon className="w-3 h-3" />{report.prediction.action}
                    </span>
                    <span>Lock: <span className="font-mono">${report.prediction.lockPrice}</span></span>
                    <span>Target: <span className="font-mono">${report.prediction.targetPrice}</span></span>
                    <span>{report.prediction.timeframe}</span>
                    <span>{format(parseISO(report.prediction.lockTime), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {outcome.label}
                  </span>
                  {outcome.status === "pending" && (
                    <span className="text-xs text-muted-foreground">{outcome.daysLeft}d left</span>
                  )}
                  {outcome.credit !== undefined && outcome.status !== "pending" && (
                    <span className="text-xs text-muted-foreground">{(outcome.credit * 100).toFixed(0)}% credit</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No predictions match this filter.</div>
      )}
    </div>
  );
}