import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Type, List, BarChart3, ChevronDown, Image, AlertTriangle, Bold, Italic, Quote } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EditorBlock from "@/components/editor/EditorBlock";
import ChartBlock from "@/components/editor/ChartBlock";
import ImageBlock from "@/components/editor/ImageBlock";
import PredictionBlock from "@/components/editor/PredictionBlock";
import AISidebar from "@/components/editor/AISidebar";
import MonetizationPanel from "@/components/editor/MonetizationPanel";

const DYOR_TEXT = "⚠️ Disclaimer: This report is for informational purposes only and does not constitute financial advice. Always do your own research (DYOR) before making any investment decisions. Past performance is not indicative of future results.";

export default function ReportEditor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([{ type: "text", content: "" }]);
  const [showAI, setShowAI] = useState(false);

  const handleBlockChange = useCallback((index, newBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? newBlock : b)));
  }, []);

  const handleBlockDelete = useCallback((index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleBlockKeyDown = useCallback((index, action) => {
    if (action === "enter") {
      setBlocks((prev) => {
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, { type: "text", content: "" });
        return newBlocks;
      });
    }
  }, []);

  const addBlock = (type, content = "") => {
    setBlocks((prev) => [...prev, { type, content }]);
  };

  const addDYOR = () => {
    setBlocks((prev) => [...prev, { type: "text", content: DYOR_TEXT }]);
    toast.success("DYOR disclaimer added");
  };

  const handleAIGenerate = (template) => {
    setTitle("Research Report: [Company Name]");
    setBlocks(template);
    toast.success("Report template generated!");
  };

  const handlePublish = (prediction) => {
    toast.success("Report published with locked prediction!", {
      description: `${prediction.action} ${prediction.ticker} → Target $${prediction.targetPrice}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-8 gap-3">
        <div>
          <h1 className="text-2xl font-bold">Write Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create data-driven research for your followers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addDYOR}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 hidden sm:flex"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Add DYOR
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assist
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Report..."
        className="text-3xl font-bold border-none bg-transparent px-0 h-auto py-2 placeholder:text-muted-foreground/30 focus-visible:ring-0 mb-6"
      />

      {/* Blocks */}
      <div className="space-y-2 min-h-[300px]">
        {blocks.map((block, index) =>
          block.type === "chart" ? (
            <ChartBlock key={index} />
          ) : block.type === "image" ? (
            <ImageBlock key={index} onDelete={() => handleBlockDelete(index)} />
          ) : (
            <EditorBlock
              key={index}
              block={block}
              index={index}
              onChange={handleBlockChange}
              onDelete={handleBlockDelete}
              onKeyDown={handleBlockKeyDown}
            />
          )
        )}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex items-center gap-2 flex-wrap border-t border-border/40 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4 mr-1" />
              Add Block
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addBlock("heading")}>
              <Type className="w-4 h-4 mr-2" /> Heading
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("text")}>
              <Type className="w-4 h-4 mr-2 opacity-60" /> Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("bullets")}>
              <List className="w-4 h-4 mr-2" /> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("quote")}>
              <Quote className="w-4 h-4 mr-2" /> Quote
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => addBlock("chart")}>
              <BarChart3 className="w-4 h-4 mr-2" /> Stock Chart
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("image")}>
              <Image className="w-4 h-4 mr-2" /> Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick actions */}
        <div className="flex items-center gap-1 border-l border-border/40 pl-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="Bold"
            onClick={() => addBlock("text", "**Bold text here**")}>
            <Bold className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="Quote"
            onClick={() => addBlock("quote")}>
            <Quote className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="Image"
            onClick={() => addBlock("image")}>
            <Image className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* DYOR mobile */}
        <Button variant="ghost" size="sm" onClick={addDYOR}
          className="text-amber-600 hover:bg-amber-50 sm:hidden ml-auto">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> DYOR
        </Button>
      </div>

      {/* Monetization */}
      <MonetizationPanel />

      {/* Prediction Block */}
      <PredictionBlock onPublish={handlePublish} />

      {/* AI Sidebar */}
      <AISidebar
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}