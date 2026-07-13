import { useTranslation } from "../lib/store/languageStore";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-espresso rounded-t-2xl sm:rounded-t-3xl py-6 sm:py-8 mt-auto safe-bottom">
      <div className="container mx-auto px-4 text-center text-brand-light-cream font-medium">
        <p className="text-base sm:text-lg mb-2">© 2026 {t("siteTitle")}</p>
        <p className="text-sm sm:text-base leading-relaxed">
          <span className="block sm:inline">{t("address")}</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">{t("phoneNumber")}</span>
        </p>
      </div>
    </footer>
  );
}