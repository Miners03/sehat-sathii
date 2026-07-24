import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppShell } from "@/layouts/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthPage } from "@/pages/AuthPage";
import { HomePage } from "@/pages/HomePage";
import { CompanionChatPage } from "@/pages/CompanionChatPage";
import { InsightsPage } from "@/pages/InsightsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { JournalPage } from "@/pages/JournalPage";
import { SelfCarePage } from "@/pages/SelfCarePage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/chat" element={<CompanionChatPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/self-care" element={<SelfCarePage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Redirect legacy routes */}
                <Route path="/checkin" element={<Navigate to="/home" replace />} />
                <Route path="/results/*" element={<Navigate to="/insights" replace />} />
                <Route path="/history" element={<Navigate to="/dashboard" replace />} />
                <Route path="/admin" element={<Navigate to="/home" replace />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
