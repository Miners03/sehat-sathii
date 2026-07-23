import React from "react";
import { Link, useLocation } from "react-router";
import { HeartPulse, History, Settings, UserCheck, LogOut, Home, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/home", label: t("appName"), icon: Home },
    { path: "/checkin", label: t("startCheckin"), icon: Sparkles },
    { path: "/history", label: t("history"), icon: History },
    { path: "/settings", label: t("settings"), icon: Settings },
    { path: "/admin", label: t("adminDashboard"), icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-text-muted/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text leading-tight group-hover:text-primary transition-colors">
              {t("appName")}
            </span>
            <span className="text-xs text-text-muted hidden sm:inline">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-text-muted hover:text-text hover:bg-bg"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language selector toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1.5 rounded-xl border border-text-muted/20 text-xs font-semibold text-text hover:bg-bg transition-colors"
            title="Toggle Language"
          >
            {language === "en" ? "हिन्दी" : "English"}
          </button>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-text-muted hover:text-escalate flex items-center gap-1.5"
              title={t("logout")}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="primary">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile navigation bar */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-text-muted/10 bg-surface px-4 py-2 flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-xs ${
                  isActive ? "text-primary font-semibold" : "text-text-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
