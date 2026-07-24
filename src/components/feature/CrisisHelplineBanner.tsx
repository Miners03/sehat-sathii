import React, { useState } from "react";
import { PhoneCall, HeartHandshake, ShieldAlert, Share2, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CrisisHelplineBannerProps {
  pinned?: boolean;
  message?: string;
  className?: string;
}

export const CrisisHelplineBanner: React.FC<CrisisHelplineBannerProps> = ({
  pinned = true,
  message,
  className = "",
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShareOrCopy = async () => {
    const textToShare = "I am sharing this helpful helpline: KIRAN Mental Health Helpline 1800-599-0019 (Toll-free 24/7). Please stay safe and talk to someone you trust.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "KIRAN Helpline", text: textToShare });
      } catch {
        // Fallback to copy
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } else {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="region"
      aria-label="KIRAN Crisis Helpline Support"
      className={`bg-reach-out/10 border-2 border-reach-out/30 rounded-2xl p-4 sm:p-5 shadow-sm text-left transition-all ${
        pinned ? "sticky top-2 z-20" : ""
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-reach-out/20 flex items-center justify-center shrink-0 text-reach-out mt-0.5">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-reach-out text-white rounded-full uppercase tracking-wider">
                Support Available 24/7
              </span>
            </div>
            <h2 className="text-lg font-bold text-text pt-1">
              {t("helplineTitle")}
            </h2>
            <p className="text-sm text-text-muted">
              {message || t("helplineDesc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:18005990019"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-reach-out hover:opacity-95 text-white font-bold rounded-xl text-base transition-transform active:scale-95 shadow-sm"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t("callNow")}</span>
            </a>

            <button
              type="button"
              onClick={handleShareOrCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-reach-out/30 text-text hover:bg-bg font-semibold rounded-xl text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-steady" /> : <Share2 className="w-4 h-4 text-reach-out" />}
              <span>{t("trustedContact")}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-reach-out/20 flex items-center gap-2 text-xs text-text-muted">
            <HeartHandshake className="w-4 h-4 text-reach-out shrink-0" />
            <span>You are not alone. Empathetic care and confidential support are always here for you.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
