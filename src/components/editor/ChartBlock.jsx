import React, { useState, useMemo } from "react";
import { generateCandlestickData, MOCK_STOCKS } from "@/lib/mockData";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
import { Input } from "@/components/ui/input";
import { BarChart3, PenLine } from "lucide-react";
import DrawingCanvas from "./DrawingCanvas";

const CustomCandle = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  const isGreen = payload.close >= payload.open;
  const color = isGreen ? "hsl(152, 60%, 48%)" : "hsl(0, 72%, 58%)";
  const bodyTop = Math.min(payload.open, payload.close);
  const bodyBottom = Math.max(payload.open, payload.close);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 0.5);
  
  return null; // We use the bar chart below
};

export default function ChartBlock() {
  const [ticker, setTicker] = useState("AAPL");
  const [showDrawing, setShowDrawing] = useState(false);

  const data = useMemo(() => {
    const raw = generateCandlestickData(ticker, 40);
    return raw.map(d => ({
      ...d,
      // For candlestick simulation using bars
      bodyBottom: Math.min(d.open, d.close),
      bodyHeight: Math.abs(d.close - d.open) || 0.3,
      isGreen: d.close >= d.open,
      wick: [d.low, d.high],
    }));
  }, [ticker]);

  const stock = MOCK_STOCKS[ticker.toUpperCase()];

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 my-3">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker..."
          className="w-28 h-8 text-sm font-mono bg-background border-border"
        />
        {stock && (
          <span className="text-sm font-mono text-muted-foreground">
            ${stock.price.toFixed(2)}
          </span>
        )}
        <button
          onClick={() => setShowDrawing(!showDrawing)}
          className={`ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${showDrawing ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
        >
          <PenLine className="w-3 h-3" />
          Draw / Patterns
        </button>
      </div>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 14%)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
              tickFormatter={(val) => val.slice(5)}
              axisLine={{ stroke: "hsl(222, 30%, 16%)" }}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
              axisLine={{ stroke: "hsl(222, 30%, 16%)" }}
              width={55}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 44%, 8%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(215, 20%, 55%)" }}
              formatter={(value, name) => {
                if (name === "close") return [`$${value.toFixed(2)}`, "Close"];
                if (name === "high") return [`$${value.toFixed(2)}`, "High"];
                if (name === "low") return [`$${value.toFixed(2)}`, "Low"];
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(152, 60%, 48%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(152, 60%, 48%)" }}
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke="hsl(152, 60%, 48%)"
              strokeWidth={0.5}
              strokeDasharray="3 3"
              dot={false}
              opacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="hsl(0, 72%, 58%)"
              strokeWidth={0.5}
              strokeDasharray="3 3"
              dot={false}
              opacity={0.3}
            />
          </ComposedChart>
        </ResponsiveContainer>
        {showDrawing && (
          <div className="absolute inset-0">
            <DrawingCanvas height={224} />
          </div>
        )}
      </div>
    </div>
  );
}