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

  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const effectiveUser = mounted ? user : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/cake-order", label: t("cakeOrder") },
    {
      href: "/cart",
      label: `${t("cart")} (${totalItems})`,
    },
    { href: "/contacts", label: t("contacts") },
    {
      href: "/account",
      label: effectiveUser
        ? `${t("account")} (${effectiveUser.name})`
        : t("login"),
    },
  ];

  return (
    <nav className="bg-brand-light-cream shadow-md rounded-b-3xl sticky top-0 z-50">
      <div className="container mx-auto px-2 flex justify-between items-center h-16">
        {/* Логотип + назва */}
        <Link href="/" className="flex items-center gap-2 -ml-16">
          <img
            src="/logo3.png"
            alt="logo"
            className="h-20 w-20 object-contain rounded-full mt-8"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='%23F86E04'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
            }}
          />
          <span className="text-2xl font-bold text-brand-dark-chocolate mt-8">
            {t("siteTitle")}
          </span>
        </Link>

        {/* Центральна навігація (десктоп) */}
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-xl text-lg font-medium transition-all duration-200 ${
                router.pathname === link.href
                  ? "text-brand-orange-zest border-b-2 border-brand-orange-zest"
                  : "text-brand-dark-chocolate hover:text-brand-orange-zest"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {mounted && effectiveUser && (
            <button
              onClick={logout}
              className="ml-2 border border-brand-caramel-mousse text-brand-caramel-mousse px-4 py-2 rounded-xl hover:bg-brand-caramel-mousse hover:text-white transition"
            >
              {t("logout")}
            </button>
          )}
        </div>

        {/* Мовний перемикач (десктоп) */}
        <div className="hidden md:flex items-center space-x-2">
          {["pl", "en", "ua"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-2 py-1 rounded-lg font-medium transition ${
                lang === l
                  ? "bg-brand-orange-zest text-white"
                  : "text-brand-dark-chocolate hover:text-brand-orange-zest"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Гамбургер (мобільний) */}
        <button
          className="md:hidden text-3xl text-brand-dark-chocolate"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Мобільне меню */}
      {menuOpen && (
        <div className="md:hidden bg-brand-light-cream px-4 pb-4 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-lg font-medium ${
                router.pathname === link.href
                  ? "text-brand-orange-zest"
                  : "text-brand-dark-chocolate"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex space-x-2 mt-2">
            {["pl", "en", "ua"].map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLanguage(l);
                  setMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-lg font-medium ${
                  lang === l
                    ? "bg-brand-orange-zest text-white"
                    : "text-brand-dark-chocolate"
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
              className="border border-brand-caramel-mousse text-brand-caramel-mousse px-4 py-2 rounded-xl"
            >
              {t("logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}