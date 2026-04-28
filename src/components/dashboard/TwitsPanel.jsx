import React, { useState } from "react";
import { MessageSquare, Heart, Repeat2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ANALYSTS } from "@/lib/mockData";

const INITIAL_TWITS = [
  { id: 1, content: "Watching NVDA open. This AI infrastructure cycle has legs — don't fight the tape. 🟢", time: "2h ago", likes: 47, liked: false },
  { id: 2, content: "Fed commentary was more hawkish than expected. Rotating out of rate-sensitive names. Staying long quality tech.", time: "1d ago", likes: 83, liked: false },
  { id: 3, content: "AMD MI300X is closing the gap faster than I expected. Keep an eye on server GPU market share data next quarter.", time: "3d ago", likes: 112, liked: false },
];

export default function TwitsPanel() {
  const analyst = MOCK_ANALYSTS[0];
  const [twits, setTwits] = useState(INITIAL_TWITS);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const post = async () => {
    if (!draft.trim() || draft.length < 5) return;
    setPosting(true);
    await new Promise((r) => setTimeout(r, 400));
    setTwits((prev) => [
      { id: Date.now(), content: draft.trim(), time: "just now", likes: 0, liked: false },
      ...prev,
    ]);
    setDraft("");
    setPosting(false);
  };

  const toggleLike = (id) => {
    setTwits((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 } : t
      )
    );
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-sm">Quick Twits</h3>
        <span className="ml-auto text-xs text-muted-foreground">{twits.length} posts</span>
      </div>

      {/* Composer */}
      <div className="px-4 py-4 border-b border-border/40 bg-secondary/20">
        <div className="flex gap-3">
          <img src={analyst.avatar} alt={analyst.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 280))}
              placeholder="What's moving the market today?"
              className="min-h-[70px] text-sm resize-none border-border/60 bg-card"
            />
            <div className="flex justify-between items-center">
              <span className={`text-xs ${draft.length > 250 ? "text-amber-600" : "text-muted-foreground"}`}>
                {draft.length}/280
              </span>
              <Button size="sm" onClick={post} disabled={posting || draft.length < 5} className="h-7 gap-1.5">
                <Send className="w-3 h-3" />
                Post Twit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-border/30 max-h-[480px] overflow-y-auto">
        {twits.map((twit) => (
          <div key={twit.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
            <div className="flex gap-3">
              <img src={analyst.avatar} alt={analyst.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">{analyst.name}</span>
                  <span className="text-[10px] text-muted-foreground">{twit.time}</span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{twit.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => toggleLike(twit.id)}
                    className={`flex items-center gap-1 text-[11px] transition-colors ${twit.liked ? "text-red-500 font-semibold" : "text-muted-foreground hover:text-red-400"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${twit.liked ? "fill-red-500" : ""}`} />
                    {twit.likes}
                  </button>
                  <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-green-600 transition-colors">
                    <Repeat2 className="w-3.5 h-3.5" />
                    Repost
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}