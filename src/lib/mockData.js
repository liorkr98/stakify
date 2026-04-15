// Mock stock data for ticker widgets
export const MOCK_STOCKS = {
  AAPL: { price: 198.45, change: 2.34, changePercent: 1.19 },
  TSLA: { price: 248.12, change: -5.67, changePercent: -2.23 },
  NVDA: { price: 875.30, change: 12.45, changePercent: 1.44 },
  MSFT: { price: 415.60, change: 3.21, changePercent: 0.78 },
  AMZN: { price: 186.75, change: -1.23, changePercent: -0.65 },
  GOOGL: { price: 155.90, change: 1.87, changePercent: 1.21 },
  META: { price: 502.30, change: 8.45, changePercent: 1.71 },
  JPM: { price: 198.20, change: -0.85, changePercent: -0.43 },
};

export const MOCK_ANALYSTS = [
  {
    id: "a1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    accuracy: 87.5,
    yearlyYield: 34.2,
    followers: 12400,
    points: 8750,
    reports: 45,
  },
  {
    id: "a2",
    name: "Marcus Webb",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    accuracy: 82.1,
    yearlyYield: 28.7,
    followers: 9800,
    points: 7320,
    reports: 38,
  },
  {
    id: "a3",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    accuracy: 79.3,
    yearlyYield: 22.1,
    followers: 7600,
    points: 6100,
    reports: 52,
  },
  {
    id: "a4",
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    accuracy: 76.8,
    yearlyYield: 19.5,
    followers: 5200,
    points: 5400,
    reports: 29,
  },
  {
    id: "a5",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    accuracy: 74.2,
    yearlyYield: 17.3,
    followers: 4100,
    points: 4800,
    reports: 33,
  },
];

export const MOCK_REPORTS = [
  {
    id: "r1",
    title: "NVIDIA: The AI Backbone Play for 2026",
    author: MOCK_ANALYSTS[0],
    tickers: ["NVDA", "MSFT"],
    prediction: { action: "Long", ticker: "NVDA", targetPrice: 1050, timeframe: "12 months", lockPrice: 875.30, lockTime: "2026-04-10T14:30:00Z" },
    likes: 342,
    publishedAt: "2026-04-10T14:30:00Z",
    excerpt: "NVIDIA continues to dominate the AI infrastructure market with its H200 and B100 chips. The data center revenue growth trajectory suggests significant upside...",
  },
  {
    id: "r2",
    title: "Tesla's Robotaxi: Overhyped or Undervalued?",
    author: MOCK_ANALYSTS[1],
    tickers: ["TSLA"],
    prediction: { action: "Hold", ticker: "TSLA", targetPrice: 260, timeframe: "6 months", lockPrice: 248.12, lockTime: "2026-04-09T10:15:00Z" },
    likes: 218,
    publishedAt: "2026-04-09T10:15:00Z",
    excerpt: "While the autonomous driving narrative is compelling, the timeline for mass deployment remains uncertain. We analyze the key catalysts and risks...",
  },
  {
    id: "r3",
    title: "Apple's AI Strategy: A Deep Dive",
    author: MOCK_ANALYSTS[2],
    tickers: ["AAPL", "GOOGL"],
    prediction: { action: "Long", ticker: "AAPL", targetPrice: 235, timeframe: "12 months", lockPrice: 198.45, lockTime: "2026-04-08T09:00:00Z" },
    likes: 156,
    publishedAt: "2026-04-08T09:00:00Z",
    excerpt: "Apple's integration of on-device AI with Apple Intelligence represents a significant competitive moat. We examine the revenue implications...",
  },
  {
    id: "r4",
    title: "Short JPMorgan: Banking Headwinds Ahead",
    author: MOCK_ANALYSTS[3],
    tickers: ["JPM"],
    prediction: { action: "Short", ticker: "JPM", targetPrice: 175, timeframe: "6 months", lockPrice: 198.20, lockTime: "2026-04-07T16:00:00Z" },
    likes: 89,
    publishedAt: "2026-04-07T16:00:00Z",
    excerpt: "Rising credit defaults and compressed net interest margins signal trouble for traditional banking. We present our bearish thesis...",
  },
  {
    id: "r5",
    title: "Meta's Metaverse Pivot: Finally Paying Off?",
    author: MOCK_ANALYSTS[4],
    tickers: ["META"],
    prediction: { action: "Long", ticker: "META", targetPrice: 580, timeframe: "9 months", lockPrice: 502.30, lockTime: "2026-04-06T11:45:00Z" },
    likes: 127,
    publishedAt: "2026-04-06T11:45:00Z",
    excerpt: "Reality Labs is showing signs of traction with enterprise VR adoption. Combined with ad revenue growth, Meta presents a compelling case...",
  },
];

// Generate mock candlestick data
export function generateCandlestickData(ticker, days = 60) {
  const stock = MOCK_STOCKS[ticker] || MOCK_STOCKS.AAPL;
  let basePrice = stock.price * 0.85;
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = basePrice * 0.03;
    const open = basePrice + (Math.random() - 0.48) * volatility;
    const close = open + (Math.random() - 0.45) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
    });
    
    basePrice = close;
  }
  
  return data;
}