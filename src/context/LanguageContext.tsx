import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  t: (key: string) => string;
}

const LANG_KEY = "sehat_saathi_lang";
const DARK_KEY = "sehat_saathi_dark";

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    appName: "SehatSaathi",
    tagline: "Your AI-powered health companion",
    startCheckin: "Start Symptom Check-in",
    history: "Check-in History",
    settings: "Settings",
    adminDashboard: "ASHA Dashboard",
    logout: "Log Out",
    welcomeBack: "Welcome back",
    phoneLabel: "Phone Number",
    otpLabel: "6-digit OTP",
    sendOTP: "Send OTP",
    verifyOTP: "Verify & Continue",
    deleteData: "Delete My Data",
    confirmDelete: "Are you sure? This will delete all check-in history and log you out.",
    darkMode: "Dark Mode",
    language: "Language",
  },
  hi: {
    appName: "सेहत साथी",
    tagline: "आपका एआई स्वास्थ्य साथी",
    startCheckin: "स्वास्थ्य जांच शुरू करें",
    history: "पुराना इतिहास",
    settings: "सेटिंग्स",
    adminDashboard: "आशा डैशबोर्ड",
    logout: "लॉग आउट",
    welcomeBack: "नमस्ते",
    phoneLabel: "फोन नंबर",
    otpLabel: "6-अंकों का ओटीपी",
    sendOTP: "ओटीपी भेजें",
    verifyOTP: "सत्यापित करें और आगे बढ़ें",
    deleteData: "मेरा डेटा हटाएं",
    confirmDelete: "क्या आप निश्चित हैं? इससे आपका सारा इतिहास हट जाएगा।",
    darkMode: "डार्क मोड",
    language: "भाषा",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(LANG_KEY) as Language) || "en"
  );

  // Light mode is the default for first-time user trust!
  const [darkMode, setDarkModeState] = useState<boolean>(
    () => localStorage.getItem(DARK_KEY) === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem(DARK_KEY, String(dark));
  };

  const t = (key: string): string => {
    return dictionary[language]?.[key] || dictionary.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, darkMode, setDarkMode, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
