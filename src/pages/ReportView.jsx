import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MOCK_REPORTS } from "@/lib/mockData";
import PredictionBadge from "@/components/feed/PredictionBadge";
import TickerTag from "@/components/feed/TickerTag";
import ShareMenu from "@/components/feed/ShareMenu";
import CommentsSection from "@/components/report/CommentsSection";
import FactChecker from "@/components/report/FactChecker";

const FULL_CONTENT = `NVIDIA's dominance in the AI infrastructure market has never been more apparent than in Q1 2026. The H200 chip, featuring 141 GB of HBM3e memory and 3.35 TB/s bandwidth, represents a 3x improvement in memory bandwidth over its predecessor.

Data center revenue grew 427% year-over-year in the latest quarter, far outpacing any comparable period in semiconductor history. The company's CUDA ecosystem — with over 4 million developers — creates an almost unassailable competitive moat that rivals simply cannot replicate in the near term.

Our DCF model, using a 10% discount rate and conservative 5-year growth projections of 30% annually, yields a fair value of approximately $1,050 per share. This assumes no further market share gains and modest margin compression from competition.

Enterprise AI capex is expected to triple by 2027, with hyperscalers like Microsoft, Google, and Amazon already committing multi-billion dollar orders for Blackwell architecture chips. No competition can match NVIDIA's end-to-end AI performance at this scale.

Catalysts include: the Blackwell ramp in H2 2026, Project DIGITS expansion, and sovereign AI initiatives across Europe and Asia.`;

export default function ReportView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get("id") || "r1";
  const isPaid = urlParams.get("paid") === "true";

  const report = MOCK_REPORTS.find((r) => r.id === reportId) || MOCK_REPORTS[0];
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </button>

      {/* Article Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {report.tickers.map((t) => (
            <TickerTag key={t} ticker={t} />
          ))}
        </div>
        <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{report.title}</h1>

        {/* Author */}
        <div className="flex items-center gap-3 py-4 border-y border-border">
          <img src={report.author.avatar} alt={report.author.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{report.author.name}</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                {report.author.accuracy}% Accuracy
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(report.publishedAt), "MMMM d, yyyy · h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}>
              <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
              {likeCount}
            </button>
            <ShareMenu title={report.title} reportId={report.id} />
          </div>
        </div>
      </div>

      {/* Prediction Badge */}
      <PredictionBadge prediction={report.prediction} />

      {/* Content */}
      <div className="mt-6 prose prose-sm max-w-none">
        {isPaid ? (
          <div className="space-y-4">
            {FULL_CONTENT.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/85 leading-relaxed text-base">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <>
            <p className="text-foreground/85 leading-relaxed text-base">{report.excerpt}</p>
            <p className="text-foreground/85 leading-relaxed text-base">
              NVIDIA's H200 chip, featuring 141 GB of HBM3e memory, represents a significant leap in memory bandwidth. Data center revenue grew 427% year-over-year in the latest quarter...
            </p>

            {/* Paywall */}
            <div className="mt-6 relative">
              <div className="h-24 bg-gradient-to-b from-transparent to-background absolute top-0 left-0 right-0 pointer-events-none" />
              <div className="border border-border rounded-2xl p-8 text-center bg-card mt-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-1">This is a Premium Report</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Unlock the full analysis, DCF model, and detailed catalysts.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={() => navigate(`/pay?mode=report&id=${report.id}&title=${encodeURIComponent(report.title)}&price=4.99`)}
                    className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto"
                  >
                    Unlock for $4.99
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/pay?mode=subscription")}
                    className="border-primary/30 text-primary hover:bg-primary/5 w-full sm:w-auto"
                  >
                    <Star className="w-3.5 h-3.5 mr-1.5" />
                    Subscribe for $9/mo
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fact Checker */}
      <FactChecker reportContent={isPaid ? FULL_CONTENT : null} />

      {/* Comments */}
      <CommentsSection />
    </div>
  );
}