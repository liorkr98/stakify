import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import TickerTag from "./TickerTag";
import PredictionBadge from "./PredictionBadge";
import ShareMenu from "./ShareMenu";

export default function ReportCard({ report }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article
      className="bg-card border border-border/60 rounded-xl p-5 hover:border-border hover:shadow-sm transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/report?id=${report.id}`)}
    >
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={report.author.avatar}
          alt={report.author.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">{report.author.name}</span>
            <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">
              {report.author.accuracy}% Accuracy
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(report.publishedAt), "MMM d, yyyy · h:mm a")}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
        {report.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
        {report.excerpt}
      </p>

      {/* Tickers */}
      <div className="flex flex-wrap gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
        {report.tickers.map((t) => (
          <TickerTag key={t} ticker={t} />
        ))}
      </div>

      {/* Prediction */}
      <PredictionBadge prediction={report.prediction} />

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => navigate(`/report?id=${report.id}#comments`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Reply</span>
        </button>
        <ShareMenu title={report.title} reportId={report.id} />
      </div>
    </article>
  );
}