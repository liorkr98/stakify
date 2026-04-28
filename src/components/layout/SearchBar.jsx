import React, { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_STOCKS, MOCK_ANALYSTS } from "@/lib/mockData";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const stockResults = query.length > 0
    ? Object.entries(MOCK_STOCKS)
        .filter(([ticker]) => ticker.includes(query.toUpperCase()))
        .slice(0, 4)
    : [];

  const analystResults = query.length > 1
    ? MOCK_ANALYSTS.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = stockResults.length > 0 || analystResults.length > 0;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block w-56 lg:w-72">
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search stocks or analysts..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {open && hasResults && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {stockResults.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                Stocks
              </p>
              {stockResults.map(([ticker, data]) => (
                <button
                  key={ticker}
                  onClick={() => { navigate(`/stock?ticker=${ticker}`); setQuery(""); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold font-mono">{ticker}</p>
                    <p className="text-xs text-muted-foreground">${data.price.toFixed(2)}</p>
                  </div>
                  <span className={`text-xs font-mono font-semibold ${data.changePercent >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.changePercent >= 0 ? "+" : ""}{data.changePercent.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          )}
          {analystResults.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 border-t">
                Analysts
              </p>
              {analystResults.map((analyst) => (
                <button
                  key={analyst.id}
                  onClick={() => { navigate(`/analyst?id=${analyst.id}`); setQuery(""); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors text-left"
                >
                  <img src={analyst.avatar} alt={analyst.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{analyst.name}</p>
                    <p className="text-xs text-muted-foreground">{analyst.accuracy}% accuracy</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{analyst.followers.toLocaleString()} followers</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}