import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PenLine, BarChart3, LogIn, Wallet, Settings, LogOut, LayoutDashboard, ChevronDown, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import AppFooter from "./AppFooter";
import SearchBar from "./SearchBar";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StoaLogo from "@/components/StoaLogo";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { path: "/", label: "Feed", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const authorInitial = (user?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-5">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-2">
            <StoaLogo size={24} textSize="text-base" />
          </Link>

          {/* Search — center */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <SearchBar />
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-0.5 ml-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/8 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Write button — always visible, styled distinctly */}
            <Link
              to="/editor"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ml-1",
                location.pathname === "/editor"
                  ? "bg-primary text-primary-foreground"
                  : "text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <PenLine className="w-4 h-4" />
              <span className="hidden md:inline">Write</span>
            </Link>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 ml-2">
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                      <div className="w-7 h-7 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {authorInitial}
                      </div>
                      <ChevronDown className="w-3 h-3 hidden md:block opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user?.full_name || "My Account"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2 opacity-70" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/wallet")}>
                      <Wallet className="w-4 h-4 mr-2 opacity-70" /> Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                      <Settings className="w-4 h-4 mr-2 opacity-70" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => base44.auth.logout("/")}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/signin" className="ml-2">
                <Button size="sm" className="gap-1.5 text-sm">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-2.5">
          <SearchBar />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
}
