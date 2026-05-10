import { create } from "zustand";
import { persist } from "zustand/middleware";
import pl from "../translations/pl.json";
import en from "../translations/en.json";
import ua from "../translations/ua.json";

const translations = { pl, en, ua };

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
  const t = (key) => translations[lang]?.[key] || key;
  return { t, lang, setLanguage };
};