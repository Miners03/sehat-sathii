import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr" | "bn" | "ta" | "te" | "gu" | "pa";

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
];

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
    tagline: "Your Multilingual AI Mental Health Companion",
    home: "Home",
    chat: "Companion Chat",
    assessment: "Assessments",
    insights: "Insights",
    dashboard: "Mood Dashboard",
    journal: "AI Journal",
    selfCare: "Self-Care Library",
    settings: "Settings",
    logout: "Log Out",
    dailyCheckin: "Daily Mood Check-In",
    helplineTitle: "KIRAN Mental Health Helpline",
    helplineNumber: "1800-599-0019",
    helplineDesc: "Toll-free, 24/7 Govt of India Helpline (13 Languages)",
    callNow: "Call 1800-599-0019",
    trustedContact: "Reach out to a trusted person",
    deleteData: "Delete My Data",
    confirmDelete: "Are you sure? This will permanently delete your check-ins, journal entries, and chat history.",
    darkMode: "Dark Mode",
    language: "Language",
    phoneLabel: "Mobile Number",
    otpLabel: "6-digit Verification Code",
    sendOTP: "Send Verification Code",
    verifyOTP: "Verify & Enter",
  },
  hi: {
    appName: "सेहत साथी",
    tagline: "आपका बहुभाषी एआई मानसिक स्वास्थ्य साथी",
    home: "होम",
    chat: "साथी चैट",
    assessment: "मानसिक मूल्यांकन",
    insights: "अंतर्दृष्टि (Insights)",
    dashboard: "मू़ड डैशबोर्ड",
    journal: "एआई डायरी",
    selfCare: "आत्म-देखभाल (Self-Care)",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    dailyCheckin: "दैनिक मूड चेक-इन",
    helplineTitle: "किरण (KIRAN) मानसिक स्वास्थ्य हेल्पलाइन",
    helplineNumber: "1800-599-0019",
    helplineDesc: "निःशुल्क, 24/7 भारत सरकार हेल्पलाइन (13 भाषाएं)",
    callNow: "कॉल करें 1800-599-0019",
    trustedContact: "किसी विश्वसनीय व्यक्ति से संपर्क करें",
    deleteData: "मेरा डेटा हटाएं",
    confirmDelete: "क्या आप निश्चित हैं? इससे आपका सारा इतिहास हट जाएगा।",
    darkMode: "डार्क मोड",
    language: "भाषा",
    phoneLabel: "मोबाइल नंबर",
    otpLabel: "6-अंकों का ओटीपी",
    sendOTP: "ओटीपी भेजें",
    verifyOTP: "सत्यापित करें",
  },
  mr: {
    appName: "सेहत साथी",
    tagline: "तुमचा बहुभाषिक AI मानसिक आरोग्य सोबती",
    home: "होम",
    chat: "संवाद सोबती",
    assessment: "मूल्यांकन",
    insights: "आढावा",
    dashboard: "मूड डॅशबोर्ड",
    journal: "AI डायरी",
    selfCare: "स्व-काळजी",
    settings: "सेटिंग्ज",
    logout: "लॉग आउट",
    dailyCheckin: "दैनिक मूड नोंदणी",
    helplineTitle: "किरण (KIRAN) मानसिक आरोग्य हेल्पलाइन",
    helplineNumber: "1800-599-0019",
    helplineDesc: "टोल-फ्री, 24/7 भारत सरकार हेल्पलाइन (13 भाषा)",
    callNow: "कॉल करा 1800-599-0019",
    trustedContact: "विश्वासू व्यक्तीशी संपर्क साधा",
    deleteData: "माझा डेटा हटवा",
    confirmDelete: "तुम्हाला नक्की सर्व डेटा हटवायचा आहे का?",
    darkMode: "डार्क मोड",
    language: "भाषा",
    phoneLabel: "मोबाईल नंबर",
    otpLabel: "OTP कोड",
    sendOTP: "OTP पाठवा",
    verifyOTP: "सत्यापित करा",
  },
  bn: {
    appName: "সেহাত সাথী",
    tagline: "আপনার এআই মানসিক স্বাস্থ্য সঙ্গী",
    home: "হোম",
    chat: "সাথী চ্যাট",
    assessment: "মূল্যায়ন",
    insights: "ইনসাইটস",
    dashboard: "মুড ড্যাশবোর্ড",
    journal: "এআই জার্নাল",
    selfCare: "স্ব-যত্ন",
    settings: "সেটিংস",
    logout: "লগ আউট",
    dailyCheckin: "দৈনিক মুড চেক-ইন",
    helplineTitle: "কিরণ (KIRAN) মানসিক স্বাস্থ্য হেল্পলাইন",
    helplineNumber: "1800-599-0019",
    helplineDesc: "টোল-ফ্রি, २४/৭ ভারত সরকার হেল্পলাইন (১৩টি ভাষা)",
    callNow: "কল করুন 1800-599-0019",
    trustedContact: "বিশ্বস্ত কারও সাথে কথা বলুন",
    deleteData: "আমার ডেটা মুছে ফেলুন",
    confirmDelete: "আপনি কি নিশ্চিত যে আপনার সমস্ত ডেটা মুছতে চান?",
    darkMode: "ডার্ক মোড",
    language: "ভাষা",
    phoneLabel: "মোবাইল নম্বর",
    otpLabel: "ওটিপি কোড",
    sendOTP: "ওটিপি পাঠান",
    verifyOTP: "যাচাই করুন",
  },
  ta: {
    appName: "சேஹத் சாதி",
    tagline: "உங்கள் AI மனநல துணைவர்",
    home: "முகப்பு",
    chat: "உரையாடல்",
    assessment: "மதிப்பீடு",
    insights: "பார்வைகள்",
    dashboard: "மனநிலை டாஷ்போர்டு",
    journal: "AI நாட்குறிப்பு",
    selfCare: "சுய பராமரிப்பு",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
    dailyCheckin: "தினசரி மனநிலை பதிவு",
    helplineTitle: "கிரண் (KIRAN) மனநல உதவி எண்",
    helplineNumber: "1800-599-0019",
    helplineDesc: "கட்டணமில்லா 24/7 இந்திய அரசு உதவி எண்",
    callNow: "அழைக்கவும் 1800-599-0019",
    trustedContact: "நம்பகமான நபரைத் தொடர்பு கொள்ளவும்",
    deleteData: "தரவை நீக்கு",
    confirmDelete: "உங்கள் அனைத்து தரவையும் நீக்க விரும்புகிறீர்களா?",
    darkMode: "இருண்ட பயன்முறை",
    language: "மொழி",
    phoneLabel: "அலைபேசி எண்",
    otpLabel: "OTP குறியீடு",
    sendOTP: "OTP அனுப்பு",
    verifyOTP: "உறுதிசெய்",
  },
  te: {
    appName: "సేహత్ సాథీ",
    tagline: "మీ AI మానసిక ఆరోగ్య తోడు",
    home: "హోమ్",
    chat: "సంభాషణ",
    assessment: "అంచనా",
    insights: "అవగాహన",
    dashboard: "మూడ్ డాష్‌బోర్డ్",
    journal: "AI జర్నల్",
    selfCare: "స్వీయ సంరక్షణ",
    settings: "సెట్టింగ్‌లు",
    logout: "లాగ్ అవుట్",
    dailyCheckin: "రోజువారీ మూడ్ చెక్-ఇన్",
    helplineTitle: "కిరణ్ (KIRAN) మానసిక ఆరోగ్య హెల్ప్‌లైన్",
    helplineNumber: "1800-599-0019",
    helplineDesc: "ఉచిత, 24/7 భారత ప్రభుత్వ హెల్ప్‌లైన్",
    callNow: "కాల్ చేయండి 1800-599-0019",
    trustedContact: "నమ్మకమైన వ్యక్తిని సంప్రదించండి",
    deleteData: "నా డేటాను తొలగించు",
    confirmDelete: "మీ డేటా మొత్తాన్ని తొలగించాలనుకుంటున్నారా?",
    darkMode: "డార్క్ మోడ్",
    language: "భాష",
    phoneLabel: "మొబైల్ సంఖ్య",
    otpLabel: "OTP కోడ్",
    sendOTP: "OTP పంపండి",
    verifyOTP: "ధృవీకరించు",
  },
  gu: {
    appName: "સેહત સાથી",
    tagline: "તમારો AI માનસિક સ્વાસ્થ્ય સાથી",
    home: "હોમ",
    chat: "સાથી ચેટ",
    assessment: "મૂલ્યાંકન",
    insights: "ઇનસાઇટ્સ",
    dashboard: "મૂડ ડેશબોર્ડ",
    journal: "AI ડાયરી",
    selfCare: "સ્વ-સંભાળ",
    settings: "સેટિંગ્સ",
    logout: "લોગ આઉટ",
    dailyCheckin: "દૈનિક મૂડ ચેક-ઇન",
    helplineTitle: "કિરણ (KIRAN) માનસિક સ્વાસ્થ્ય હેલ્પલાઇન",
    helplineNumber: "1800-599-0019",
    helplineDesc: "ટોલ-ફ્રી, 24/7 ભારત સરકાર હેલ્પલાઇન",
    callNow: "કોલ કરો 1800-599-0019",
    trustedContact: "વિશ્વાસુ વ્યક્તિનો સંપર્ક કરો",
    deleteData: "મારો ડેટા કાઢી નાખો",
    confirmDelete: "શું તમે તમારો બધો ડેટા કાઢી નાખવા માંગો છો?",
    darkMode: "ડાર્ક મોડ",
    language: "ભાષા",
    phoneLabel: "મોબાઇલ નંબર",
    otpLabel: "OTP કોડ",
    sendOTP: "OTP મોકલો",
    verifyOTP: "ચકાસો",
  },
  pa: {
    appName: "ਸੇਹਤ ਸਾਥੀ",
    tagline: "ਤੁਹਾਡਾ AI ਮਾਨਸਿਕ ਸਿਹਤ ਸਾਥੀ",
    home: "ਹੋਮ",
    chat: "ਸਾਥੀ ਚੈਟ",
    assessment: "ਮੁਲਾਂਕਣ",
    insights: "ਇਨਸਾਈਟਸ",
    dashboard: "ਮੂਡ ਡੈਸ਼ਬੋਰਡ",
    journal: "AI ਡਾਇਰੀ",
    selfCare: "ਸਵੈ-ਦੇਖਭਾਲ",
    settings: "ਸੈਟਿੰਗਾਂ",
    logout: "ਲੌਗ ਆਉਟ",
    dailyCheckin: "ਰੋਜ਼ਾਨਾ ਮੂਡ ਚੈੱਕ-ਇਨ",
    helplineTitle: "ਕਿਰਨ (KIRAN) ਮਾਨਸਿਕ ਸਿਹਤ ਹੈਲਪਲਾਈਨ",
    helplineNumber: "1800-599-0019",
    helplineDesc: "ਟੋਲ-ਫ੍ਰੀ, 24/7 ਭਾਰਤ ਸਰਕਾਰ ਹੈਲਪਲਾਈਨ",
    callNow: "ਕਾਲ ਕਰੋ 1800-599-0019",
    trustedContact: "ਕਿਸੇ ਭਰੋਸੇਮੰਦ ਵਿਅਕਤੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    deleteData: "ਮੇਰਾ ਡਾਟਾ ਮਿਟਾਓ",
    confirmDelete: "ਕੀ ਤੁਸੀਂ ਆਪਣਾ ਸਾਰਾ ਡਾਟਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    darkMode: "ਡਾਰਕ ਮੋਡ",
    language: "ਭਾਸ਼ਾ",
    phoneLabel: "ਮੋਬਾਈਲ ਨੰਬਰ",
    otpLabel: "OTP ਕੋਡ",
    sendOTP: "OTP ਭੇਜੋ",
    verifyOTP: "ਤਸਦੀਕ ਕਰੋ",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(LANG_KEY) as Language) || "en"
  );

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
