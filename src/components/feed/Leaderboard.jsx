import React from "react";
import { MOCK_ANALYSTS } from "@/lib/mockData";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const RANK_COLORS = ["text-accent", "text-muted-foreground", "text-orange-400"];
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <h3 className="font-bold text-sm">Top Analysts</h3>
        </div>
      </div>
      <div className="divide-y divide-border/30">
        {MOCK_ANALYSTS.map((analyst, index) => (
          <div key={analyst.id} className="px-5 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/analyst?id=${analyst.id}`)}>
            <span className={`text-lg font-bold w-6 text-center ${RANK_COLORS[index] || "text-muted-foreground"}`}>
              {index + 1}
            </span>
            <img
              src={analyst.avatar}
              alt={analyst.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">{analyst.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] text-gain">
                  <Target className="w-3 h-3" />
                  {analyst.accuracy}%
                </span>
                <span className="flex items-center gap-1 text-[11px] text-primary">
                  <TrendingUp className="w-3 h-3" />
                  +{analyst.yearlyYield}% YoY
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}