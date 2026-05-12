import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Type, List, BarChart3, Image, Quote, Send, Save, FolderOpen, Trash2, ChevronDown, AlignLeft, Heading2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { publishReport } from "@/lib/mockData";
import EditorBlock from "@/components/editor/EditorBlock";
import StockChartBlock from "@/components/editor/StockChartBlock";
import ImageBlock from "@/components/editor/ImageBlock";
import PredictionBlock from "@/components/editor/PredictionBlock";
import AISidebar from "@/components/editor/AISidebar";
import MonetizationPanel from "@/components/editor/MonetizationPanel";
import FactChecker from "@/components/report/FactChecker";
import AIChat from "@/components/editor/AIChat";
import BoostPanel from "@/components/editor/BoostPanel";

const DYOR_TEXT = "⚠️ Disclaimer: This report is for informational purposes only and does not constitute financial advice. Always do your own research (DYOR) before making any investment decisions.";

const BLOCK_MENU_ITEMS = [
  { type: "heading",    label: "Heading",      icon: Heading2,  desc: "Section title" },
  { type: "text",       label: "Paragraph",    icon: AlignLeft, desc: "Body text" },
  { type: "bullets",    label: "Bullet List",  icon: List,      desc: "Key points" },
  { type: "quote",      label: "Pull Quote",   icon: Quote,     desc: "Highlight a quote" },
];

const RICH_BLOCK_ITEMS = [
  { type: "stockchart", label: "Stock Chart",  icon: BarChart3, desc: "Interactive price chart" },
  { type: "image",      label: "Image",        icon: Image,     desc: "Upload or embed image" },
];

export default function ReportEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([{ type: "text", content: "", id: 0 }]);
  const nextId = useRef(1);
  const [showAI, setShowAI] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [drafts, setDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("stoa_drafts")) || []; } catch { return []; }
  });
  const [showDrafts, setShowDrafts] = useState(false);

  const saveDraft = () => {
    if (!title.trim() && blocks.every(b => !b.content?.trim())) {
      toast.error("Nothing to save."); return;
    }
    const draft = { id: Date.now(), title: title || "Untitled Draft", blocks, predictionData, savedAt: new Date().toISOString() };
    const updated = [draft, ...drafts.slice(0, 9)];
    setDrafts(updated);
    localStorage.setItem("stoa_drafts", JSON.stringify(updated));
    toast.success("Draft saved.");
  };

  const loadDraft = (draft) => {
    setTitle(draft.title);
    setBlocks(draft.blocks);
    setPredictionData(draft.predictionData || null);
    setShowDrafts(false);
    toast.success("Draft loaded.");
  };

  const deleteDraft = (id) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("stoa_drafts", JSON.stringify(updated));
  };

  const handleBlockChange = useCallback((index, newBlock) => {
    setBlocks(prev => prev.map((b, i) => (i === index ? newBlock : b)));
  }, []);

  const handleBlockDelete = useCallback((index) => {
    setBlocks(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }, []);

  const handleBlockKeyDown = useCallback((index, action) => {
    if (action === "enter") {
      setBlocks(prev => {
        const n = [...prev];
        n.splice(index + 1, 0, { type: "text", content: "", id: nextId.current++ });
        return n;
      });
    }
  }, []);

  const addBlock = (type) => setBlocks(prev => [...prev, { type, content: "", id: nextId.current++ }]);

  const addDYOR = () => {
    setBlocks(prev => [...prev, { type: "text", content: DYOR_TEXT, id: nextId.current++ }]);
    toast.success("DYOR disclaimer added.");
  };

  const handlePublish = () => {
    if (!title.trim()) { toast.error("Please add a title before publishing."); return; }
    const hasContent = blocks.some(b => b.content?.trim());
    if (!hasContent) { toast.error("Please add some content before publishing."); return; }
    setPublishing(true);
    try {
      const tickers = blocks
        .map(b => b.content?.match(/\$([A-Z]{2,5})/g) || []).flat()
        .map(t => t.replace("$", ""))
        .filter((v, i, a) => a.indexOf(v) === i);
      const excerpt = blocks.find(b => b.type === "text" && b.content?.trim())?.content?.slice(0, 200) || "";
      publishReport({ title, content_blocks: blocks, tickers, excerpt, prediction: predictionData, isPremium: false });
      toast.success("Report published! It's live on the feed.");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      toast.error("Failed to publish. Please try again.");
      setPublishing(false);
    }
  };

  const handleAIGenerate = (template) => {
    setBlocks(template.map(b => ({ ...b, id: nextId.current++ })));
    toast.success("Template loaded — all blocks are editable.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky toolbar */}
      <div className="sticky top-[60px] z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2 flex-wrap">
          {/* Left: drafts */}
          <Button variant="ghost" size="sm" onClick={() => setShowDrafts(v => !v)} className="text-xs gap-1.5 text-muted-foreground relative">
            <FolderOpen className="w-3.5 h-3.5" />
            Drafts
            {drafts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                {drafts.length}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={saveDraft} className="text-xs gap-1.5 text-muted-foreground">
            <Save className="w-3.5 h-3.5" />Save Draft
          </Button>
          <Button variant="ghost" size="sm" onClick={addDYOR} className="text-xs text-muted-foreground hidden sm:flex">
            DYOR
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => setShowAI(true)}
              className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/8"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Assist
            </Button>
            <Button size="sm" onClick={handlePublish} disabled={publishing} className="text-xs gap-1.5 min-w-[90px]">
              <Send className="w-3.5 h-3.5" />
              {publishing ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Drafts panel */}
      {showDrafts && (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">Saved Drafts</h3>
            {drafts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No drafts saved yet.</p>
            ) : (
              <div className="space-y-2">
                {drafts.map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.savedAt).toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => loadDraft(d)} className="text-xs">Load</Button>
                    <button onClick={() => deleteDraft(d.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Writing area — centered, comfortable column */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">

        {/* Title — large, serif */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Report title…"
          rows={1}
          className="w-full font-serif text-[2rem] sm:text-[2.4rem] font-bold text-foreground bg-transparent border-none outline-none resize-none leading-tight placeholder:text-muted-foreground/30 mb-8"
          style={{ fieldSizing: "content" }}
          onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
        />

        {/* Prediction block (above content if set) */}
        {showPrediction && (
          <div className="mb-8">
            <PredictionBlock
              onPublish={p => {
                setPredictionData(p);
                toast.success(`Prediction locked: ${p.action} $${p.ticker}`);
              }}
            />
          </div>
        )}

        {/* Content blocks */}
        <div className="space-y-1 mb-6">
          {blocks.map((block, index) =>
            block.type === "stockchart" ? (
              <StockChartBlock key={block.id} onDelete={() => handleBlockDelete(index)} />
            ) : block.type === "image" ? (
              <ImageBlock key={block.id} onDelete={() => handleBlockDelete(index)} />
            ) : (
              <EditorBlock
                key={block.id}
                block={block}
                index={index}
                onChange={nb => handleBlockChange(index, nb)}
                onDelete={() => handleBlockDelete(index)}
                onKeyDown={action => handleBlockKeyDown(index, action)}
              />
            )
          )}
        </div>

        {/* Add block / prediction row */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Text</DropdownMenuLabel>
              {BLOCK_MENU_ITEMS.map(item => (
                <DropdownMenuItem key={item.type} onClick={() => addBlock(item.type)} className="flex items-start gap-2.5 py-2">
                  <item.icon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Media</DropdownMenuLabel>
              {RICH_BLOCK_ITEMS.map(item => (
                <DropdownMenuItem key={item.type} onClick={() => addBlock(item.type)} className="flex items-start gap-2.5 py-2">
                  <item.icon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setShowPrediction(p => !p)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              showPrediction
                ? "bg-primary/8 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            {showPrediction ? "✓ Prediction added" : "+ Add Prediction"}
          </button>

          {predictionData && (
            <span className="text-xs text-gain font-medium">
              {predictionData.action} ${predictionData.ticker} · {predictionData.timeframe}
            </span>
          )}
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <MonetizationPanel />
          <BoostPanel />
        </div>

        <div className="mb-8">
          <FactChecker content={[title, ...blocks.map(b => b.content)].filter(Boolean).join("\n\n")} />
        </div>
      </div>

      <AISidebar isOpen={showAI} onClose={() => setShowAI(false)} onGenerate={handleAIGenerate} />
      <AIChat
        reportContent={[title, ...blocks.map(b => b.content)].filter(Boolean).join("\n\n")}
        onInsertBlock={text => {
          addBlock("text");
          setBlocks(prev => {
            const n = [...prev];
            n[n.length - 1] = { ...n[n.length - 1], content: text };
            return n;
          });
          toast.success("Block inserted.");
        }}
      />
    </div>
  );
}
