import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowUp, ArrowDown, Minus, Clock, Shield } from "lucide-react";
import { MOCK_STOCKS } from "@/lib/mockData";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function PredictionBlock({ onPublish }) {
  const [mode, setMode] = useState("target"); // "target" | "typical"
  const [action, setAction] = useState("");
  const [ticker, setTicker] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [rationale, setRationale] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockData, setLockData] = useState(null);

  const handlePublish = () => {
    const stock = MOCK_STOCKS[ticker.toUpperCase()];
    const lockPrice = stock ? stock.price : (targetPrice ? parseFloat(targetPrice) * 0.9 : null);

    const data = {
      mode,
      action,
      ticker: ticker.toUpperCase(),
      targetPrice: mode === "target" ? parseFloat(targetPrice) : null,
      timeframe,
      rationale,
      lockPrice,
      lockTime: new Date().toISOString(),
    };

    setLockData(data);
    setLocked(true);
    if (onPublish) onPublish(data);
  };

  const isValid = mode === "target"
    ? action && ticker && targetPrice && timeframe
    : action && ticker && timeframe;

  const ACTION_ICONS = { Long: ArrowUp, Short: ArrowDown, Hold: Minus };
  const ACTION_COLORS = {
    Long: "text-gain border-gain/30 bg-gain/5",
    Short: "text-loss border-loss/30 bg-loss/5",
    Hold: "text-accent border-accent/30 bg-accent/5",
  };

  return (
    <div className="my-6 border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-secondary/50 border-b border-border/40 flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-bold">Prediction Block</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-auto">
          {locked ? "Locked" : "Required"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!locked ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            {/* Mode toggle */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setMode("target")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${mode === "target" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                🎯 Price Target
              </button>
              <button
                onClick={() => setMode("typical")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${mode === "typical" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                📊 Typical Stock (No Target)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Action
                </label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Long">
                      <span className="flex items-center gap-2 text-gain">
                        <ArrowUp className="w-3.5 h-3.5" /> Long
                      </span>
                    </SelectItem>
                    <SelectItem value="Short">
                      <span className="flex items-center gap-2 text-loss">
                        <ArrowDown className="w-3.5 h-3.5" /> Short
                      </span>
                    </SelectItem>
                    <SelectItem value="Hold">
                      <span className="flex items-center gap-2 text-accent">
                        <Minus className="w-3.5 h-3.5" /> Hold
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Asset / Ticker
                </label>
                <Input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL"
                  className="font-mono bg-background border-border"
                />
              </div>

              {mode === "target" ? (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Target Price
                  </label>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="$0.00"
                    className="font-mono bg-background border-border"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Rationale (optional)
                  </label>
                  <Input
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="e.g. Undervalued relative to peers"
                    className="bg-background border-border"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Timeframe
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select timeframe..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month">1 Month</SelectItem>
                    <SelectItem value="3 months">3 Months</SelectItem>
                    <SelectItem value="6 months">6 Months</SelectItem>
                    <SelectItem value="12 months">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handlePublish}
              disabled={!isValid}
              className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              size="lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              Publish Report & Lock Prediction
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5"
          >
            <div className={`rounded-lg border p-4 ${ACTION_COLORS[lockData.action]}`}>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">
                  Prediction Locked
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-lg font-bold">
                  {React.createElement(ACTION_ICONS[lockData.action], { className: "w-5 h-5" })}
                  {lockData.action}
                </div>
                <span className="font-mono text-lg font-bold">${lockData.ticker}</span>
                {lockData.mode === "target" ? (
                  <span className="text-sm">
                    Target: <span className="font-bold font-mono">${lockData.targetPrice}</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Typical Pick</span>
                )}
                <span className="text-sm">({lockData.timeframe})</span>
              </div>
              {lockData.rationale && (
                <p className="text-xs mt-2 opacity-80">{lockData.rationale}</p>
              )}

              <div className="mt-3 flex items-center gap-4 text-xs opacity-80">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(lockData.lockTime), "MMM d, yyyy · HH:mm:ss")}
                </span>
                {lockData.lockPrice && (
                  <span>
                    Entry Price: <span className="font-mono font-bold">${lockData.lockPrice.toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}