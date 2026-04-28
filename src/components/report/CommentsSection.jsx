import React, { useState } from "react";
import { MessageCircle, ThumbsUp, Reply, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const MOCK_COMMENTS = [
  {
    id: "c1",
    author: { name: "Alex Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face" },
    content: "Great analysis on NVDA! The H200 supply constraint point is underappreciated by the market.",
    likes: 14,
    time: "2026-04-11T08:00:00Z",
    replies: [
      {
        id: "c1r1",
        author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face" },
        content: "Exactly my thinking too — the fab capacity is the real moat here.",
        likes: 6,
        time: "2026-04-11T09:15:00Z",
      },
    ],
  },
  {
    id: "c2",
    author: { name: "James Tran", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&h=60&fit=crop&crop=face" },
    content: "I'd push back on the 12-month target. Competition from AMD and custom silicon could compress margins faster than modeled.",
    likes: 9,
    time: "2026-04-12T14:22:00Z",
    replies: [],
  },
];

function CommentItem({ comment, isReply = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(comment.replies || []);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    setLocalReplies((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        author: { name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" },
        content: replyText.trim(),
        likes: 0,
        time: new Date().toISOString(),
      },
    ]);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className={isReply ? "ml-10 mt-3" : ""}>
      <div className="flex gap-3">
        <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="bg-muted/60 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-foreground mb-1">{comment.author.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1.5 px-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${liked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ThumbsUp className="w-3 h-3" />
              {likeCount > 0 && likeCount}
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            <span className="text-xs text-muted-foreground">{format(new Date(comment.time), "MMM d, h:mm a")}</span>
          </div>

          {showReply && (
            <div className="flex gap-2 mt-2 ml-1">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="text-sm min-h-[60px] resize-none"
              />
              <Button size="sm" onClick={submitReply} className="self-end">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {localReplies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CommentsSection() {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const submitComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: { name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" },
        content: newComment.trim(),
        likes: 0,
        time: new Date().toISOString(),
        replies: [],
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-base font-bold flex items-center gap-2 mb-5">
        <MessageCircle className="w-5 h-5 text-primary" />
        Discussion <span className="text-muted-foreground font-normal text-sm">({comments.length})</span>
      </h3>

      {/* New Comment */}
      <div className="flex gap-3 mb-6">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
          alt="You"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this report..."
            className="text-sm min-h-[72px] resize-none flex-1"
          />
          <Button size="sm" onClick={submitComment} className="self-end">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}