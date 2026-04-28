import React, { useState } from "react";
import { Heart, MessageCircle, Lock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import TickerTag from "./TickerTag";
import ShareMenu from "./ShareMenu";

const ACTION_CONFIG = {
  Long:  { color: "text-gain", bg: "bg-gain/10 border-gain/20", icon: TrendingUp },
  Short: { color: "text-loss", bg: "bg-loss/10 border-loss/20", icon: TrendingDown },
  Hold:  { color: "text-accent", bg: "bg-accent/10 border-accent/20", icon: Minus },
};

export default function ReportCard({ report, compact = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const actionCfg = ACTION_CONFIG[report.prediction?.action] || ACTION_CONFIG.Hold;
  const ActionIcon = actionCfg.icon;

  return (
    <article
      className={`bg-card border border-border/60 rounded-xl hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden ${compact ? "p-4" : "p-5"}`}
      onClick={() => navigate(`/report?id=${report.id}`)}
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/analyst?id=${report.author.id}`); }}
          className="flex-shrink-0"
        >
          <img
            src={report.author.avatar}
            alt={report.author.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-border group-hover:ring-primary/30 transition-all"
          />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/analyst?id=${report.author.id}`); }}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
            >
              {report.author.name}
            </button>
            <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">
              {report.author.accuracy}%
            </span>
            {report.isPremium && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium">
                <Lock className="w-2.5 h-2.5" /> Premium
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(report.publishedAt), "MMM d, yyyy")}
          </span>
        </div>

        {/* Prediction pill */}
        {report.prediction && (
          <div className={`hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${actionCfg.bg} ${actionCfg.color}`}>
            <ActionIcon className="w-3 h-3" />
            {report.prediction.action} ${report.prediction.ticker}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors ${compact ? "text-base line-clamp-2" : "text-lg"}`}>
        {report.title}
      </h3>

      {/* Excerpt */}
      {!compact && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
          {report.excerpt}
        </p>
      )}

      {/* Tickers */}
      <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
        {report.tickers.map((t) => (
          <TickerTag key={t} ticker={t} />
        ))}
      </div>

      {/* Mobile prediction strip */}
      {report.prediction && (
        <div className={`sm:hidden flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border mb-3 ${actionCfg.bg} ${actionCfg.color}`}>
          <ActionIcon className="w-3.5 h-3.5" />
          {report.prediction.action} · ${report.prediction.ticker} → ${report.prediction.targetPrice}
          <span className="ml-auto font-normal text-muted-foreground">{report.prediction.timeframe}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 pt-3 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => navigate(`/report?id=${report.id}#comments`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <ShareMenu title={report.title} reportId={report.id} />
        {report.isPremium && (
          <span className="ml-auto text-xs font-semibold text-amber-600">${report.price}</span>
        )}
      </div>
    </article>
  );
}