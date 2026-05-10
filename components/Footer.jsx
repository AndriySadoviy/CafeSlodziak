import { useTranslation } from "../lib/store/languageStore";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-espresso rounded-t-3xl py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-brand-light-cream font-medium">
        <p className="text-lg mb-2">© 2024 {t("siteTitle")}</p>
        <p>{t("address")} | {t("phoneNumber")}</p>
      </div>
    </footer>
  );
}