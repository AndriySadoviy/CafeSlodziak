import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useAuthStore from "../lib/store/authStore";
import useCartStore from "../lib/store/cartStore";
import { useTranslation } from "../lib/store/languageStore";

export default function Navbar() {
  const router = useRouter();
  const { t, lang, setLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const logout = useAuthStore((s) => s.logout);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const effectiveUser = mounted ? user : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/cake-order", label: t("slodkiStol") },
    { href: "/slony-stol", label: t("slonyStol") },
    { href: "/urodziny", label: t("urodziny") },
    { href: "/katering", label: t("katering") },
    { href: "/cart", label: `${t("cart")} (${totalItems})` },
    { href: "/contacts", label: t("contacts") },
    {
      href: "/account",
      label: effectiveUser ? t("account") : t("login"),
    },
  ];

  const linkClass = (href) =>
    `px-1.5 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      router.pathname === href
        ? "text-brand-orange-zest font-semibold"
        : "text-brand-dark-chocolate hover:text-brand-orange-zest"
    }`;

  const mobileLinkClass = (href) =>
    `block px-4 py-3 rounded-xl text-base font-medium ${
      router.pathname === href
        ? "bg-brand-orange-zest text-white"
        : "text-brand-dark-chocolate hover:bg-brand-orange-light/40"
    }`;

  return (
    <nav className="bg-brand-light-cream shadow-md sticky top-0 z-50 safe-top">
      {/* Один ряд на десктопі */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-2 h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo3.png"
              alt="logo"
              className="h-10 w-10 object-contain rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23F86E04'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
              }}
            />
            <span className="hidden xl:inline text-lg font-bold text-brand-dark-chocolate">
              {t("siteTitle")}
            </span>
          </Link>

          {/* Десктоп: меню між логотипом і мовою — без накладання */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-0.5 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            {mounted && effectiveUser?.role === "admin" && (
              <Link href="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {["pl", "en", "ua"].map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-1 rounded-lg text-sm font-medium transition ${
                  lang === l
                    ? "bg-brand-orange-zest text-white"
                    : "text-brand-dark-chocolate hover:text-brand-orange-zest"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
            {mounted && effectiveUser && (
              <button
                onClick={logout}
                className="ml-1 border border-brand-caramel-mousse text-brand-caramel-mousse px-2 py-1 rounded-lg text-sm hover:bg-brand-caramel-mousse hover:text-white transition"
              >
                {t("logout")}
              </button>
            )}
          </div>

          {/* Мобільний: кошик + бургер */}
          <div className="flex lg:hidden items-center gap-2 shrink-0 ml-auto">
            <Link
              href="/cart"
              className="relative p-2 rounded-xl bg-white border border-brand-caramel-mousse/30"
              aria-label={t("cart")}
            >
              <span className="text-lg">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange-zest text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="p-2 rounded-xl border border-brand-caramel-mousse/30 bg-white"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-brand-dark-chocolate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[min(100%,320px)] bg-brand-light-cream shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-brand-caramel-mousse/20">
              <span className="font-bold text-brand-dark-chocolate">{t("menu")}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white"
                aria-label="Zamknij"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={mobileLinkClass(link.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {mounted && effectiveUser?.role === "admin" && (
                <Link href="/admin" className={mobileLinkClass("/admin")} onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
            </div>

            <div className="p-4 border-t border-brand-caramel-mousse/20 space-y-3">
              <div className="flex gap-2">
                {["pl", "en", "ua"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${
                      lang === l
                        ? "bg-brand-orange-zest text-white"
                        : "bg-white text-brand-dark-chocolate border border-brand-caramel-mousse/30"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              {mounted && effectiveUser && (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full border border-brand-caramel-mousse text-brand-caramel-mousse py-2.5 rounded-xl text-sm font-medium"
                >
                  {t("logout")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}