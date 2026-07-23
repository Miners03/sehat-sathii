import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "@/layouts/Navbar";

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-text-muted/10 py-6 text-center text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SehatSaathi. Accessible AI Triage & Community Health Support.</p>
          <p className="text-text-muted/70">KIRAN Helpline: 1800-599-0019</p>
        </div>
      </footer>
    </div>
  );
};
