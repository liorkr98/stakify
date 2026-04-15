import React from "react";
import { MOCK_STOCKS } from "@/lib/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TickerWidget({ ticker }) {
  const stock = MOCK_STOCKS[ticker.toUpperCase()];
  if (!stock) return null;

  const isPositive = stock.change >= 0;

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg bg-secondary border border-border cursor-default align-middle"
      contentEditable={false}
    >
      <span className="font-mono font-bold text-primary text-sm">${ticker.toUpperCase()}</span>
      <span className="font-mono text-foreground text-sm">${stock.price.toFixed(2)}</span>
      <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-gain" : "text-loss"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
      </span>
    </span>
  );
}