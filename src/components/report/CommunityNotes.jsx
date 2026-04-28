import React, { useState } from "react";
import { Users, ThumbsUp, ThumbsDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MOCK_NOTES = [
  {
    id: 1,
    text: "The 427% YoY data center revenue figure is accurate per NVIDIA's Q4 FY2026 earnings release, but it compares against a low base from the prior year when crypto demand collapsed.",
    helpful: 84,
    notHelpful: 6,
    status: "helpful",
  },
  {
    id: 2,
    text: "AMD's MI300X GPU has shown comparable inference performance to H100 in several independent MLPerf benchmarks, making the claim that 'no competition can match NVIDIA' an overstatement.",
    helpful: 61,
    notHelpful: 12,
    status: "helpful",
  },
];

export default function CommunityNotes({ claimText }) {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [voted, setVoted] = useState({});

  const vote = (id, type) => {
    if (voted[id]) return;
    setVoted((prev) => ({ ...prev, [id]: type }));
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, helpful: type === "up" ? n.helpful + 1 : n.helpful, notHelpful: type === "down" ? n.notHelpful + 1 : n.notHelpful }
          : n
      )
    );
  };

  const submitNote = () => {
    if (!draft.trim() || draft.length < 30) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), text: draft.trim(), helpful: 0, notHelpful: 0, status: "pending" },
    ]);
    setDraft("");
    setWriting(false);
  };

  return (
    <div className="mt-3 border-t border-blue-100 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700">
          <Users className="w-3 h-3" />
          Community Notes ({notes.length})
        </span>
        <button
          onClick={() => setWriting(!writing)}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {writing ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {writing ? "Cancel" : "Add note"}
        </button>
      </div>

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            {note.status === "pending" && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mb-1.5 inline-block">
                Pending review
              </span>
            )}
            <p className="text-xs text-foreground/85 leading-relaxed">{note.text}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => vote(note.id, "up")}
                disabled={!!voted[note.id]}
                className={`flex items-center gap-1 text-[11px] transition-colors ${
                  voted[note.id] === "up" ? "text-green-600 font-semibold" : "text-muted-foreground hover:text-green-600"
                } disabled:cursor-default`}
              >
                <ThumbsUp className="w-3 h-3" />
                Helpful ({note.helpful})
              </button>
              <button
                onClick={() => vote(note.id, "down")}
                disabled={!!voted[note.id]}
                className={`flex items-center gap-1 text-[11px] transition-colors ${
                  voted[note.id] === "down" ? "text-red-600 font-semibold" : "text-muted-foreground hover:text-red-500"
                } disabled:cursor-default`}
              >
                <ThumbsDown className="w-3 h-3" />
                Not helpful ({note.notHelpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {writing && (
        <div className="mt-3 space-y-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add context that helps readers better evaluate this claim. Be factual and cite sources where possible. Min 30 characters."
            className="text-xs min-h-[80px] border-blue-200 focus:border-blue-400"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground">{draft.length} chars (min 30)</span>
            <Button size="sm" onClick={submitNote} disabled={draft.length < 30} className="h-7 text-xs">
              Submit Note
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}