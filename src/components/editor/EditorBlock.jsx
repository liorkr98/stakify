import React, { useRef, useCallback, useEffect } from "react";
import { Trash2 } from "lucide-react";

const BLOCK_STYLES = {
  heading: "font-serif text-[1.75rem] font-bold text-foreground leading-tight",
  subheading: "font-serif text-[1.3rem] font-semibold text-foreground leading-snug",
  text: "text-[1rem] text-foreground/90 leading-[1.8] font-sans",
  bullets: "text-[1rem] text-foreground/90 leading-[1.8] whitespace-pre-wrap font-sans",
  quote: "font-serif text-[1.15rem] text-foreground/70 italic border-l-[3px] border-primary/30 pl-5 py-1",
};

const PLACEHOLDERS = {
  heading: "Section heading...",
  subheading: "Sub-heading...",
  text: "Write your analysis...",
  bullets: "• Key point\n• Supporting evidence\n• Conclusion",
  quote: "A key quote or data point worth highlighting...",
};

export default function EditorBlock({ block, index, onChange, onDelete, onKeyDown }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== block.content) {
      ref.current.innerText = block.content || "";
    }
  }, [block.content]);

  const handleInput = useCallback(() => {
    if (ref.current) onChange(index, { ...block, content: ref.current.innerText });
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

  return (
    <div className="group relative flex gap-3 items-start py-0.5">
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={PLACEHOLDERS[block.type] || "Write..."}
        className={`
          flex-1 min-h-[1.6em] outline-none
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-muted-foreground/35
          empty:before:pointer-events-none
          focus:empty:before:opacity-100
          ${BLOCK_STYLES[block.type] || BLOCK_STYLES.text}
        `}
      />
      <button
        onClick={() => onDelete(index)}
        className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-1 rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        title="Delete block"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
