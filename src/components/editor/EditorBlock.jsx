import React, { useRef, useCallback } from "react";
import { Grip, Trash2 } from "lucide-react";
import TickerWidget from "./TickerWidget";
import { MOCK_STOCKS } from "@/lib/mockData";

function renderTextWithTickers(text) {
  if (!text) return null;
  // Split by $TICKER pattern
  const parts = text.split(/(\$[A-Z]{1,5})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\$([A-Z]{1,5})$/);
    if (match && MOCK_STOCKS[match[1]]) {
      return <TickerWidget key={i} ticker={match[1]} />;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function EditorBlock({ block, index, onChange, onDelete, onKeyDown }) {
  const ref = useRef(null);

  const handleInput = useCallback(() => {
    if (ref.current) {
      const text = ref.current.innerText;
      onChange(index, { ...block, content: text });
    }
  }, [index, block, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "bullets") {
      e.preventDefault();
      onKeyDown(index, "enter");
    }
    if (e.key === "Backspace" && !block.content && index > 0) {
      e.preventDefault();
      onDelete(index);
    }
  };

  const BLOCK_STYLES = {
    heading: "text-xl font-bold text-foreground",
    text: "text-sm text-foreground/90 leading-relaxed",
    bullets: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap",
  };

  const BLOCK_PLACEHOLDERS = {
    heading: "Heading...",
    text: "Write your analysis... Use $TICKER for live data",
    bullets: "• Add bullet points...",
  };

  // Check for tickers in content for display
  const hasTickers = block.content && /\$[A-Z]{1,5}/.test(block.content);

  return (
    <div className="group flex items-start gap-2 py-1 -ml-8 pl-8 relative">
      <div className="absolute left-0 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
        <button className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab">
          <Grip className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(index)}
          className="p-0.5 text-muted-foreground hover:text-loss"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {hasTickers ? (
        <div className={`flex-1 outline-none min-h-[1.5em] ${BLOCK_STYLES[block.type]}`}>
          {renderTextWithTickers(block.content)}
          <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="outline-none min-h-[1.5em] mt-1 text-transparent caret-foreground relative"
            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          />
        </div>
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={BLOCK_PLACEHOLDERS[block.type]}
          className={`flex-1 outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 ${BLOCK_STYLES[block.type]}`}
        />
      )}
    </div>
  );
}