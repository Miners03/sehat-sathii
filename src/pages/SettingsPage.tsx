import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Moon, Sun, Trash2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { deleteUserDataService } from "@/services/authService";

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, darkMode, setDarkMode, t } = useLanguage();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteData = () => {
    deleteUserDataService();
    logout();
    navigate("/auth");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{t("settings")}</h1>
        <p className="text-sm text-text-muted">Manage language preferences, appearance, and personal data</p>
      </div>

      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-bold text-text">Account Information</h2>
        <div className="text-sm text-text-muted space-y-1">
          <p><strong className="text-text">Name:</strong> {user?.name || "User"}</p>
          <p><strong className="text-text">Phone:</strong> {user?.phone || "Not connected"}</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-text">{t("language")} / भाषा</h2>
            <p className="text-xs text-text-muted">Select your preferred app interface language</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setLanguage("en")}
            className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${
              language === "en"
                ? "border-primary bg-primary/10 text-primary"
                : "border-text-muted/20 text-text hover:bg-bg"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${
              language === "hi"
                ? "border-primary bg-primary/10 text-primary"
                : "border-text-muted/20 text-text hover:bg-bg"
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-6 h-6 text-primary" /> : <Sun className="w-6 h-6 text-monitor" />}
            <div>
              <h2 className="text-lg font-bold text-text">{t("darkMode")}</h2>
              <p className="text-xs text-text-muted">Light mode is recommended for maximum accessibility</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              darkMode ? "bg-primary" : "bg-text-muted/30"
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </Card>

      <Card className="p-6 space-y-4 border-2 border-escalate/20 bg-escalate/5">
        <div className="flex items-center gap-3">
          <Trash2 className="w-6 h-6 text-escalate" />
          <div>
            <h2 className="text-lg font-bold text-text">{t("deleteData")}</h2>
            <p className="text-xs text-text-muted">Permanently erase all local check-in history and log out</p>
          </div>
        </div>

        {showConfirmDelete ? (
          <div className="p-4 bg-surface rounded-xl border border-escalate/30 space-y-3">
            <div className="flex items-center gap-2 text-escalate font-semibold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>{t("confirmDelete")}</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button variant="primary" size="sm" onClick={handleDeleteData} className="bg-escalate hover:bg-escalate/90">
                Yes, Delete Everything
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" size="md" onClick={() => setShowConfirmDelete(true)} className="text-escalate border-escalate/30 hover:bg-escalate/10">
            <Trash2 className="w-4 h-4 mr-2" /> {t("deleteData")}
          </Button>
        )}
      </Card>
    </div>
  );
};
