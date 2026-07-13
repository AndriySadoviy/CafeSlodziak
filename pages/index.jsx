import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "../lib/store/languageStore";

export default function Home() {
  const { t } = useTranslation();
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Власні зображення для галереї (10 штук, як у вашій папці)
  const galleryImages = [
  "/video/1.jpg",
  "/video/2.jpg",
  "/video/3.jpg",
  "/video/5.jpg",
  "/video/6.jpg",
  "/video/7.jpg",
  "/video/8.jpg",
  "/video/10.jpg",
];
  // Автоматичне перемикання слайдів кожні 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4) % galleryImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Отримуємо поточні 4 зображення
  const currentImages = [
    galleryImages[currentIndex],
    galleryImages[(currentIndex + 1) % galleryImages.length],
    galleryImages[(currentIndex + 2) % galleryImages.length],
    galleryImages[(currentIndex + 3) % galleryImages.length],
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setPopular(data.slice(0, 4));
        setSeasonal(data.filter((p) => p.category === "seasonal"));
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Hero з відео (виправлено) */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center py-10 sm:py-16 min-h-[220px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          poster="/images/hero-fallback.jpg"
        >
          <source src="/video/video123.MOV" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
        <div className="relative z-20 text-white px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-base sm:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            {t("heroSubtitle")}
          </p>
          <Link href="/menu">
            <button className="bg-brand-orange-zest hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-6 sm:px-8 rounded-3xl text-base sm:text-lg shadow-2xl transition-colors min-h-[44px]">
              {t("viewMenu")}
            </button>
          </Link>
        </div>
      </motion.section>

      {/* Popular dishes */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark-chocolate mb-4 sm:mb-6">
          {t("popularDishes")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Seasonal offers */}
      <section className="bg-brand-light-cream/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark-chocolate mb-4 sm:mb-6">
          {t("seasonalOffers")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonal.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Gallery – тепер запрацює */}
      <section>
  <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark-chocolate mb-4 sm:mb-6">
    {t("gallery")}
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
    {currentImages.map((src, idx) => (
      <motion.div
        key={`${currentIndex}-${idx}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl shadow-lg"
        style={{ aspectRatio: "4 / 3" }}   // ← універсальне співвідношення
      >
        <img
          src={src}
          alt="Gallery"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/400x300?text=No+image";
          }}
        />
      </motion.div>
    ))}
  </div>
</section>
    </div>
  );
}