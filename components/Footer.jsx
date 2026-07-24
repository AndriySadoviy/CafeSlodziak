import { useTranslation } from "../lib/store/languageStore";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/18zuLrbn1x/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/cafeslodziak_rzeszow/",
};

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto w-full bg-brand-espresso py-6 sm:py-8 safe-bottom">
      <div className="container mx-auto px-4 text-center text-brand-light-cream font-medium">
        <div className="flex justify-center gap-4 mb-4">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-brand-orange-zest flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 shrink-0 block fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.026 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.026 24 18.1 24 12.073z" />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-brand-orange-zest flex items-center justify-center transition-colors"
          >
            <svg
              className="w-5 h-5 shrink-0 block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
        <p className="text-base sm:text-lg mb-2">© 2026 {t("siteTitle")}</p>
        <p className="text-sm sm:text-base leading-relaxed">
          <span className="block sm:inline">{t("address")}</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">{t("phoneNumber")}</span>
        </p>
        <p className="text-sm mt-2 text-brand-caramel-mousse">{t("workingHours")}</p>
      </div>
    </footer>
  );
}