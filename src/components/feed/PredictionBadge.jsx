import React from "react";
import { Lock, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { format } from "date-fns";

const ACTION_STYLES = {
  Long: { bg: "bg-gain/10 border-gain/20", text: "text-gain", icon: ArrowUp },
  Short: { bg: "bg-loss/10 border-loss/20", text: "text-loss", icon: ArrowDown },
  Hold: { bg: "bg-accent/10 border-accent/20", text: "text-accent", icon: Minus },
};

export default function PredictionBadge({ prediction }) {
  if (!prediction) return null;

  const style = ACTION_STYLES[prediction.action] || ACTION_STYLES.Hold;
  const Icon = style.icon;

  return (
    <div className={`rounded-lg border ${style.bg} p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Locked Prediction
        </span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${style.bg} border ${style.text} text-sm font-bold`}>
          <Icon className="w-3.5 h-3.5" />
          {prediction.action}
        </div>
        <span className="font-mono text-sm font-semibold text-foreground">
          ${prediction.ticker}
        </span>
        <span className="text-sm text-muted-foreground">
          Target: <span className="text-foreground font-semibold">${prediction.targetPrice}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          ({prediction.timeframe})
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>Locked at <span className="font-mono text-foreground">${prediction.lockPrice}</span></span>
        {prediction.lockTime && (
          <span>• {format(new Date(prediction.lockTime), "MMM d, yyyy HH:mm")}</span>
        )}
      </div>
    </div>
  );
}