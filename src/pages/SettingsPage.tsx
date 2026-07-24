import React, { useState } from "react";
import { Settings, Globe, Moon, Trash2, ShieldAlert, LogOut, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CrisisHelplineBanner } from "@/components/feature/CrisisHelplineBanner";
import { useLanguage, SUPPORTED_LANGUAGES, type Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, darkMode, setDarkMode, t } = useLanguage();
  const { logout } = useAuth();
  const [showHelpline, setShowHelpline] = useState(false);

  const handleDeleteData = () => {
    if (window.confirm(t("confirmDelete"))) {
      localStorage.clear();
      logout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{t("settings")}</h1>
            <p className="text-sm text-text-muted">Preferences, privacy controls, and language selection</p>
          </div>
        </div>
      </div>

      {/* Language Selector Card */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-4 text-left">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-text">{t("language")}</h2>
            <p className="text-xs text-text-muted">Select your preferred Indian regional language script</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code as Language)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20"
                    : "border-text-muted/15 bg-bg hover:bg-surface"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-text">{lang.nativeName}</div>
                  <div className="text-xs text-text-muted">{lang.label}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Dark Mode Toggle Card */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-lg font-bold text-text">{t("darkMode")}</h2>
            <p className="text-xs text-text-muted">Toggle comfortable night viewing</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
            darkMode ? "bg-primary justify-end" : "bg-text-muted/30 justify-start"
          }`}
          aria-label="Toggle Dark Mode"
        >
          <span className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
        </button>
      </Card>

      {/* Crisis Support Shortcut */}
      <Card className="p-6 bg-surface border border-reach-out/30 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-reach-out" />
            <div>
              <h2 className="text-lg font-bold text-text">Mental Health Crisis Support</h2>
              <p className="text-xs text-text-muted">KIRAN Helpline is always 1 tap away</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowHelpline(!showHelpline)}
            className="text-reach-out border-reach-out/30"
          >
            {showHelpline ? "Hide" : "Show Helpline"}
          </Button>
        </div>

        {showHelpline && <CrisisHelplineBanner pinned={false} />}
      </Card>

      {/* Privacy & Account Controls */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm text-left space-y-4">
        <h2 className="text-lg font-bold text-text">Privacy & Account</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleDeleteData}
            className="text-reach-out border-reach-out/30 hover:bg-reach-out/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("deleteData")}
          </Button>
          <Button variant="secondary" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
