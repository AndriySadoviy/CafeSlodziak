import { useTranslation } from "../lib/store/languageStore";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="relative mt-auto safe-bottom pt-5 sm:pt-7">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[108%] h-10 sm:h-14 bg-brand-espresso rounded-t-[100%] pointer-events-none"
        aria-hidden="true"
      />
      <footer className="relative bg-brand-espresso py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-brand-light-cream font-medium">
        <p className="text-base sm:text-lg mb-2">© 2026 {t("siteTitle")}</p>
        <p className="text-sm sm:text-base leading-relaxed">
          <span className="block sm:inline">{t("address")}</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">{t("phoneNumber")}</span>
        </p>
        </div>
      </footer>
    </div>
  );
}