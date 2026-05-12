import React, { useState } from "react";
import { Heart, MessageCircle, TrendingUp, TrendingDown, Minus, Lock } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import TickerTag from "./TickerTag";
import ShareMenu from "./ShareMenu";

const ACTION_CONFIG = {
  Long:  { color: "text-gain",       bg: "bg-gain/8 border-gain/20",         icon: TrendingUp,  label: "Long"  },
  Short: { color: "text-loss",       bg: "bg-loss/8 border-loss/20",          icon: TrendingDown, label: "Short" },
  Hold:  { color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",      icon: Minus,        label: "Hold"  },
};

export default function ReportCard({ report, compact = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes || 0);
  const navigate = useNavigate();

  const authorName = report.author_name || report.created_by?.split("@")[0] || "Analyst";
  const authorInitial = authorName.trim()[0]?.toUpperCase() || "A";
  const authorAvatar = report.author_avatar || null;
  const isPremium = report.is_premium || report.isPremium || false;

  const prediction = report.prediction_action
    ? { action: report.prediction_action, ticker: report.prediction_ticker, targetPrice: report.prediction_target_price, timeframe: report.prediction_timeframe }
    : report.prediction || null;

  const publishedDate = report.created_date || report.publishedAt;
  const actionCfg = ACTION_CONFIG[prediction?.action] || ACTION_CONFIG.Hold;
  const ActionIcon = actionCfg.icon;

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article
      onClick={() => navigate(`/report?id=${report.id}`)}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:border-border/60 transition-all duration-200 cursor-pointer group"
    >
      <div className="p-5 sm:p-6">
        {/* Author row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full border border-border bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0 overflow-hidden">
              {authorAvatar
                ? <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                : authorInitial
              }
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground block truncate">{authorName}</span>
              {publishedDate && (
                <span className="text-[11px] text-muted-foreground">
                  {format(new Date(publishedDate), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Lock className="w-2.5 h-2.5" /> Premium
              </span>
            )}
            {prediction && (
              <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${actionCfg.bg} ${actionCfg.color}`}>
                <ActionIcon className="w-3 h-3" />
                {prediction.action} {prediction.ticker && `$${prediction.ticker}`}
              </span>
            )}
          </div>
        </div>

        {/* Title — serif, editorial */}
        <h3 className="font-serif font-bold text-[1.25rem] sm:text-[1.35rem] leading-snug text-foreground mb-2 group-hover:text-primary transition-colors duration-150">
          {report.title}
        </h3>

        {/* Excerpt */}
        {!compact && report.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {report.excerpt}
          </p>
        )}

        {/* Tickers */}
        {(report.tickers || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" onClick={e => e.stopPropagation()}>
            {(report.tickers || []).map(t => <TickerTag key={t} ticker={t} />)}
          </div>
        )}

        {/* Prediction card */}
        {prediction && (
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs px-4 py-2.5 rounded-xl border mb-4 ${actionCfg.bg}`}>
            <ActionIcon className={`w-3.5 h-3.5 ${actionCfg.color} flex-shrink-0`} />
            <span className={`font-bold ${actionCfg.color}`}>{prediction.action}</span>
            {prediction.ticker && (
              <span className="font-mono font-bold text-foreground">${prediction.ticker}</span>
            )}
            {prediction.targetPrice && (
              <>
                <span className="text-muted-foreground">→ target</span>
                <span className="font-bold text-foreground">${prediction.targetPrice}</span>
              </>
            )}
            {prediction.timeframe && (
              <span className="text-muted-foreground ml-auto">{prediction.timeframe}</span>
            )}
          </div>
        )}
      </div>

      {/* Action bar — separated with subtle border */}
      <div className="px-5 sm:px-6 py-3 border-t border-border/60 bg-secondary/30 flex items-center gap-5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-all active:scale-90 ${liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-150 ${liked ? "fill-rose-500 scale-110" : ""}`} />
          <span className="text-xs font-medium">{likeCount}</span>
        </button>

        <button
          onClick={e => { e.stopPropagation(); navigate(`/report?id=${report.id}#comments`); }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Comment</span>
        </button>

        {isPremium && report.price && (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            ${report.price}
          </span>
        )}

        <span onClick={e => e.stopPropagation()} className="ml-auto">
          <ShareMenu title={report.title} reportId={report.id} />
        </span>
      </div>
    </article>
  );
}
