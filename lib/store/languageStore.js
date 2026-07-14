import { create } from "zustand";
import { persist } from "zustand/middleware";
import pl from "../translations/pl.json";
import en from "../translations/en.json";
import ua from "../translations/ua.json";
import servicesPl from "../translations/services-pl.json";
import servicesEn from "../translations/services-en.json";
import servicesUa from "../translations/services-ua.json";

const translations = {
  pl: { ...servicesPl, ...pl },
  en: { ...servicesEn, ...en },
  ua: { ...servicesUa, ...ua },
};

export const useLanguageStore = create(
  persist(
    (set) => ({
      lang: "pl",
      setLanguage: (lang) => set({ lang }),
    }),
    { name: "language-storage" }
  )
);

export const useTranslation = () => {
  const lang = useLanguageStore((s) => s.lang);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const t = (key) =>
    translations[lang]?.[key] || translations.pl?.[key] || key;
  return { t, lang, setLanguage };
};