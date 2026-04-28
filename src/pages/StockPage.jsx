import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, FileText, Newspaper, Star, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_STOCKS, MOCK_REPORTS, generateCandlestickData } from "@/lib/mockData";

const TABS = ["Chart", "Fundamentals", "Financials", "News", "Reports"];

const FUNDAMENTALS = {
  NVDA: { pe: 42.3, eps: 11.93, marketCap: "2.3T", divYield: "0.03%", beta: 1.72, week52High: 974, week52Low: 402, avgVolume: "42M" },
  AAPL: { pe: 29.1, eps: 6.57, marketCap: "3.1T", divYield: "0.51%", beta: 1.24, week52High: 220, week52Low: 164, avgVolume: "62M" },
  TSLA: { pe: 55.8, eps: 2.99, marketCap: "680B", divYield: "N/A", beta: 2.31, week52High: 299, week52Low: 138, avgVolume: "112M" },
  MSFT: { pe: 35.4, eps: 13.1, marketCap: "3.0T", divYield: "0.72%", beta: 0.89, week52High: 468, week52Low: 366, avgVolume: "21M" },
  GOOGL: { pe: 22.7, eps: 7.96, marketCap: "2.1T", divYield: "0.46%", beta: 1.04, week52High: 193, week52Low: 130, avgVolume: "25M" },
  AMD:  { pe: 60.2, eps: 1.41, marketCap: "280B", divYield: "N/A", beta: 1.95, week52High: 227, week52Low: 122, avgVolume: "55M" },
};

const FINANCIALS = {
  NVDA: { revenue: "$88.6B", grossProfit: "$63.2B", netIncome: "$48.2B", operatingCF: "$51.4B", totalAssets: "$96.0B", totalDebt: "$8.5B" },
  AAPL: { revenue: "$383B", grossProfit: "$170B", netIncome: "$97B", operatingCF: "$115B", totalAssets: "$352B", totalDebt: "$104B" },
  TSLA: { revenue: "$97.7B", grossProfit: "$17.7B", netIncome: "$7.1B", operatingCF: "$14.6B", totalAssets: "$106B", totalDebt: "$7.6B" },
  MSFT: { revenue: "$245B", grossProfit: "$171B", netIncome: "$86B", operatingCF: "$109B", totalAssets: "$512B", totalDebt: "$59.5B" },
  GOOGL: { revenue: "$307B", grossProfit: "$175B", netIncome: "$73B", operatingCF: "$101B", totalAssets: "$402B", totalDebt: "$13.3B" },
  AMD:  { revenue: "$22.7B", grossProfit: "$10.6B", netIncome: "$854M", operatingCF: "$1.7B", totalAssets: "$67.9B", totalDebt: "$1.7B" },
};

const MOCK_NEWS = [
  { id: 1, title: "NVIDIA announces next-gen Blackwell Ultra architecture", source: "Reuters", time: "2h ago", sentiment: "positive" },
  { id: 2, title: "AI chip demand expected to triple by 2027", source: "Bloomberg", time: "5h ago", sentiment: "positive" },
  { id: 3, title: "Semiconductor export restrictions may impact Q2 guidance", source: "WSJ", time: "1d ago", sentiment: "negative" },
  { id: 4, title: "Data center spending by hyperscalers hits record high", source: "CNBC", time: "1d ago", sentiment: "positive" },
  { id: 5, title: "New competitor GPU benchmarks released", source: "TechCrunch", time: "2d ago", sentiment: "neutral" },
];

const RANGES = ["1W", "1M", "3M", "6M", "1Y"];

function buildPriceHistory(basePrice, days) {
  const data = [];
  let price = basePrice * 0.75;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    price = Math.max(price * (1 + (Math.random() - 0.47) * 0.025), basePrice * 0.5);
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({ date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), price: parseFloat(price.toFixed(2)) });
  }
  // make last point match current price
  data[data.length - 1].price = basePrice;
  return data;
}

const rangeDays = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };

export default function StockPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const ticker = urlParams.get("ticker")?.toUpperCase() || "NVDA";

  const stockData = MOCK_STOCKS[ticker];
  const [activeTab, setActiveTab] = useState("Chart");
  const [range, setRange] = useState("3M");

  const priceHistory = useMemo(() => buildPriceHistory(stockData?.price || 500, rangeDays[range]), [ticker, range]);

  const fundamentals = FUNDAMENTALS[ticker] || FUNDAMENTALS.NVDA;
  const financials = FINANCIALS[ticker] || FINANCIALS.NVDA;

  const relatedReports = MOCK_REPORTS.filter((r) =>
    r.tickers?.includes(ticker) || r.prediction_ticker === ticker
  );

  const isUp = stockData?.changePercent >= 0;
  const chartColor = isUp ? "hsl(152,55%,38%)" : "hsl(0,72%,52%)";

  if (!stockData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Stock "{ticker}" not found.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold font-mono">{ticker}</h1>
              <Badge variant="outline" className="text-xs">NASDAQ</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ticker === "NVDA" ? "NVIDIA Corporation" : ticker === "AAPL" ? "Apple Inc." : ticker === "TSLA" ? "Tesla Inc." : ticker === "MSFT" ? "Microsoft Corporation" : ticker === "GOOGL" ? "Alphabet Inc." : ticker === "AMD" ? "Advanced Micro Devices" : ticker + " Inc."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono">${stockData.price.toFixed(2)}</p>
          <div className={`flex items-center justify-end gap-1 mt-1 ${isUp ? "text-gain" : "text-loss"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-semibold">{isUp ? "+" : ""}{stockData.change?.toFixed(2) || "0.00"} ({isUp ? "+" : ""}{stockData.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border/40 pb-3 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Chart Tab */}
      {activeTab === "Chart" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold">Price History</p>
              <p className="text-xs text-muted-foreground">All values in USD</p>
            </div>
            <div className="flex gap-1">
              {RANGES.map((r) => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${range === r ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                interval={Math.floor(priceHistory.length / 6)} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `$${v}`} width={60} />
              <Tooltip formatter={(v) => [`$${v}`, "Price"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill="url(#stockGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Fundamentals Tab */}
      {activeTab === "Fundamentals" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "P/E Ratio", value: fundamentals.pe },
            { label: "EPS (TTM)", value: `$${fundamentals.eps}` },
            { label: "Market Cap", value: fundamentals.marketCap },
            { label: "Dividend Yield", value: fundamentals.divYield },
            { label: "Beta", value: fundamentals.beta },
            { label: "52W High", value: `$${fundamentals.week52High}` },
            { label: "52W Low", value: `$${fundamentals.week52Low}` },
            { label: "Avg Volume", value: fundamentals.avgVolume },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-bold font-mono">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Financials Tab */}
      {activeTab === "Financials" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40">
            <p className="font-semibold">Annual Financials (TTM)</p>
            <p className="text-xs text-muted-foreground">Trailing twelve months</p>
          </div>
          <div className="divide-y divide-border/40">
            {[
              { label: "Revenue", value: financials.revenue, icon: "💰" },
              { label: "Gross Profit", value: financials.grossProfit, icon: "📈" },
              { label: "Net Income", value: financials.netIncome, icon: "✅" },
              { label: "Operating Cash Flow", value: financials.operatingCF, icon: "🔄" },
              { label: "Total Assets", value: financials.totalAssets, icon: "🏦" },
              { label: "Total Debt", value: financials.totalDebt, icon: "📉" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{row.icon}</span>
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                </div>
                <span className="font-bold font-mono">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News Tab */}
      {activeTab === "News" && (
        <div className="space-y-3">
          {MOCK_NEWS.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:border-border/80 transition-colors cursor-pointer">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.sentiment === "positive" ? "bg-gain" : item.sentiment === "negative" ? "bg-loss" : "bg-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold leading-snug">{item.title.replace("NVIDIA", ticker === "NVDA" ? "NVIDIA" : ticker)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${item.sentiment === "positive" ? "border-gain/30 text-gain" : item.sentiment === "negative" ? "border-loss/30 text-loss" : "border-border text-muted-foreground"}`}>
                {item.sentiment}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "Reports" && (
        <div>
          {relatedReports.length > 0 ? (
            <div className="space-y-4">
              {relatedReports.map((r) => (
                <div key={r.id} className="cursor-pointer" onClick={() => navigate(`/report?id=${r.id}`)}>
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={r.author.avatar} alt={r.author.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-semibold">{r.author.name}</span>
                      <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{r.author.accuracy}%</span>
                    </div>
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.likes} likes · {r.isPremium ? `$${r.price}` : "Free"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No analyst reports for {ticker} yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}