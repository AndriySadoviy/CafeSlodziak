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
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
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
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.28 6.068 2.266 6.477 2.266 12c0 5.523.014 5.932.072 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297 1.28.058 1.689.072 7.212.072s5.932-.014 7.212-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.058-1.28.072-1.689.072-7.212s-.014-5.932-.072-7.212c-.058-1.278-.33-2.451-1.297-3.418C21.451.402 20.278.13 19 .072 17.72.014 17.311 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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