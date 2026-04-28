import React, { useRef, useState, useEffect, useCallback } from "react";
import { Pencil, Minus, Square, TrendingUp, Trash2, Type } from "lucide-react";

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

const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ffffff", "#000000"];

export default function DrawingCanvas({ width = 600, height = 260 }) {
  const canvasRef = useRef(null);
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

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const redraw = useCallback((ctx) => {
    ctx.clearRect(0, 0, width, height);
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
          const extended = { x: p.points[1].x + dx * 0.5, y: p.points[1].y + dy * 0.5 };
          ctx.setLineDash([5, 5]);
          ctx.moveTo(p.points[1].x, p.points[1].y);
          ctx.lineTo(extended.x, extended.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else if (p.type === "rect" && p.points.length >= 2) {
        ctx.strokeRect(
          p.points[0].x, p.points[0].y,
          p.points[1].x - p.points[0].x,
          p.points[1].y - p.points[0].y
        );
      }
    });
    annotations.forEach((a) => {
      ctx.fillStyle = a.color || "#f59e0b";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(a.label, a.x, a.y);
    });
  }, [paths, annotations, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    redraw(ctx);
  }, [redraw]);

  const onMouseDown = (e) => {
    const pos = getPos(e);
    setDrawing(true);
    setStartPos(pos);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setSnapshot(ctx.getImageData(0, 0, width, height));
    if (tool === "pencil") setCurrentPath([pos]);
  };

  const onMouseMove = (e) => {
    if (!drawing) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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
    setAnnotations((prev) => [...prev, { label: `[${pattern.emoji} ${pattern.label}]`, x: 20, y: 30 + prev.length * 20, color: "#f59e0b" }]);
    setShowPatterns(false);
  };

  const clearAll = () => {
    setPaths([]);
    setAnnotations([]);
  };

  return (
    <div className="mt-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-secondary/50 rounded-lg border border-border">
        <div className="flex gap-1">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                title={t.label}
                className={`p-1.5 rounded-md transition-colors ${tool === t.id ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
        <div className="w-px h-5 bg-border" />
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="w-px h-5 bg-border" />
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="text-xs border border-border rounded px-1 py-0.5 bg-background"
        >
          <option value={1}>Thin</option>
          <option value={2}>Normal</option>
          <option value={4}>Thick</option>
        </select>
        <div className="w-px h-5 bg-border" />
        <div className="relative">
          <button
            onClick={() => setShowPatterns(!showPatterns)}
            className="text-xs px-2 py-1 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3" /> Patterns
          </button>
          {showPatterns && (
            <div className="absolute top-full left-0 mt-1 z-10 bg-card border border-border rounded-xl shadow-lg p-2 grid grid-cols-2 gap-1 w-48">
              {PATTERNS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => addPattern(p)}
                  className="text-xs px-2 py-1.5 rounded-lg hover:bg-muted text-left flex items-center gap-1.5"
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={clearAll}
          className="ml-auto p-1.5 text-muted-foreground hover:text-loss transition-colors"
          title="Clear drawing"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
        className="w-full rounded-lg border border-dashed border-primary/30 cursor-crosshair bg-transparent"
        style={{ touchAction: "none" }}
      />
      <p className="text-[10px] text-muted-foreground mt-1">Draw trendlines, levels, and patterns directly on the chart above.</p>
    </div>
  );
}