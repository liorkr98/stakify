import React from "react";
import { Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const PLATFORMS = [
  {
    label: "X (Twitter)",
    icon: Twitter,
    color: "text-sky-500",
    getUrl: (title, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    getUrl: (_, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-700",
    getUrl: (title, url) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    label: "Reddit",
    icon: null,
    color: "text-orange-500",
    emoji: "🤖",
    getUrl: (title, url) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    label: "StockTwits",
    icon: null,
    color: "text-purple-500",
    emoji: "📈",
    getUrl: (title, url) =>
      `https://stocktwits.com/submit?body=${encodeURIComponent(title + " " + url)}`,
  },
];

export default function ShareMenu({ title, reportId }) {
  const reportUrl = `${window.location.origin}/report/${reportId}`;

  const handleShare = (platform) => {
    window.open(platform.getUrl(title, reportUrl), "_blank", "noopener,width=600,height=500");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {PLATFORMS.map((p, i) => (
          <React.Fragment key={p.label}>
            {i === 3 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => handleShare(p)} className="cursor-pointer">
              <span className={`flex items-center gap-2 ${p.color}`}>
                {p.icon ? (
                  <p.icon className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 flex items-center justify-center text-xs">{p.emoji}</span>
                )}
                {p.label}
              </span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}