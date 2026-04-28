import React, { useState, useRef } from "react";
import { Image, Trash2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ImageBlock({ onDelete }) {
  const [url, setUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUrl(file_url);
    setUploading(false);
  };

  return (
    <div className="group relative my-3 rounded-xl border border-border overflow-hidden bg-secondary/30">
      {!url ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center gap-3 py-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </button>
      ) : (
        <div>
          <img src={url} alt="Report visual" className="w-full max-h-96 object-cover" />
          <div className="px-4 py-2 border-t border-border/40">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="w-full text-xs text-muted-foreground bg-transparent outline-none"
            />
          </div>
        </div>
      )}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}