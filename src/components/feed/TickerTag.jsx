import React from "react";
import { MOCK_STOCKS } from "@/lib/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TickerTag({ ticker }) {
  const stock = MOCK_STOCKS[ticker];
  if (!stock) return <span className="text-primary font-mono font-semibold">${ticker}</span>;

  const isPositive = stock.change >= 0;

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary border border-border text-xs font-mono font-medium">
      <span className="text-primary font-semibold">${ticker}</span>
      <span className="text-muted-foreground">${stock.price.toFixed(2)}</span>
      <span className={`flex items-center gap-0.5 ${isPositive ? "text-gain" : "text-loss"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
      </span>
    </span>
  );
}