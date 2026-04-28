import React, { useRef, useState, useEffect, useCallback } from "react";
import { Pencil, Minus, Square, TrendingUp, Trash2 } from "lucide-react";

const PATTERNS = [
  { label: "Head & Shoulders", emoji: "📈" },
  { label: "Double Bottom", emoji: "W" },
  { label: "Double Top", emoji: "M" },
  { label: "Bull Flag", emoji: "🏁" },
  { label: "Cup & Handle", emoji: "☕" },
  { label: "Triangle", emoji: "△" },
];

const TOOLS = [
  { id: "pencil", icon: Pencil, label: "Draw" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "rect", icon: Square, label: "Rect" },
  { id: "trend", icon: TrendingUp, label: "Trend" },
];

const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ffffff"];

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#ef4444");
  const [lineWidth, setLineWidth] = useState(2);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [showPatterns, setShowPatterns] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 224 });

  // Sync canvas pixel size to actual rendered size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const redraw = useCallback((ctx) => {
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    paths.forEach((p) => {
      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (p.type === "pencil" && p.points.length > 0) {
        ctx.moveTo(p.points[0].x, p.points[0].y);
        p.points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
      } else if ((p.type === "line" || p.type === "trend") && p.points.length >= 2) {
        ctx.moveTo(p.points[0].x, p.points[0].y);
        ctx.lineTo(p.points[1].x, p.points[1].y);
        ctx.stroke();
        if (p.type === "trend") {
          const dx = p.points[1].x - p.points[0].x;
          const dy = p.points[1].y - p.points[0].y;
          ctx.setLineDash([5, 5]);
          ctx.moveTo(p.points[1].x, p.points[1].y);
          ctx.lineTo(p.points[1].x + dx * 0.5, p.points[1].y + dy * 0.5);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else if (p.type === "rect" && p.points.length >= 2) {
        ctx.strokeRect(p.points[0].x, p.points[0].y, p.points[1].x - p.points[0].x, p.points[1].y - p.points[0].y);
      }
    });
    annotations.forEach((a) => {
      ctx.fillStyle = a.color || "#f59e0b";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(a.label, a.x, a.y);
    });
  }, [paths, annotations, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    redraw(ctx);
  }, [redraw]);

  const onMouseDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    setDrawing(true);
    setStartPos(pos);
    const ctx = canvasRef.current.getContext("2d");
    setSnapshot(ctx.getImageData(0, 0, canvasSize.w, canvasSize.h));
    if (tool === "pencil") setCurrentPath([pos]);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");

    if (tool === "pencil") {
      const newPath = [...currentPath, pos];
      setCurrentPath(newPath);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (newPath.length >= 2) {
        ctx.moveTo(newPath[newPath.length - 2].x, newPath[newPath.length - 2].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    } else {
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      redraw(ctx);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      if (tool === "line" || tool === "trend") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      }
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    setDrawing(false);
    if (tool === "pencil") {
      setPaths((prev) => [...prev, { type: "pencil", color, lineWidth, points: currentPath }]);
      setCurrentPath([]);
    } else {
      setPaths((prev) => [...prev, { type: tool, color, lineWidth, points: [startPos, pos] }]);
    }
  };

  const addPattern = (pattern) => {
    setAnnotations((prev) => [...prev, { label: `${pattern.emoji} ${pattern.label}`, x: 20, y: 24 + prev.length * 22, color: "#f59e0b" }]);
    setShowPatterns(false);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 px-2 py-1 bg-background/90 backdrop-blur border-b border-border/60 z-10 flex-shrink-0">
        <div className="flex gap-1">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                className={`p-1.5 rounded transition-colors ${tool === t.id ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>
                <Icon className="w-3 h-3" />
              </button>
            );
          })}
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-4 h-4 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-125" : "border-transparent"}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="w-px h-4 bg-border" />
        <select value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
          className="text-[10px] border border-border rounded px-1 py-0.5 bg-background">
          <option value={1}>Thin</option>
          <option value={2}>Normal</option>
          <option value={4}>Thick</option>
        </select>
        <div className="relative">
          <button onClick={() => setShowPatterns(!showPatterns)}
            className="text-[10px] px-2 py-0.5 border border-border rounded hover:bg-muted transition-colors flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Patterns
          </button>
          {showPatterns && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-lg p-2 grid grid-cols-2 gap-1 w-44">
              {PATTERNS.map((p) => (
                <button key={p.label} onClick={() => addPattern(p)}
                  className="text-[10px] px-2 py-1 rounded hover:bg-muted text-left flex items-center gap-1">
                  <span>{p.emoji}</span><span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => { setPaths([]); setAnnotations([]); }} className="ml-auto p-1 text-muted-foreground hover:text-loss" title="Clear">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {/* Canvas fills remaining space */}
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h - 32}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
        className="flex-1 cursor-crosshair bg-transparent"
        style={{ touchAction: "none", display: "block" }}
      />
    </div>
  );
}