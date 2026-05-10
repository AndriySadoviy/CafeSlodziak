import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "../lib/store/languageStore";

export default function Home() {
  const { t } = useTranslation();
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [gallery] = useState([
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534452203293-494d7b9d8357?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1545128485-c400fc35cd10?w=600&h=400&fit=crop",
  ]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setPopular(data.slice(0, 4));
        setSeasonal(data.filter((p) => p.category === "seasonal"));
      });
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero з відео фоном */}
      <motion.section
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative text-center py-16 rounded-3xl overflow-hidden"
>
  {/* Відео фон */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
    poster="/images/hero-fallback.jpg"
    onError={(e) => {
      // Якщо відео не завантажилось, показуємо fallback-зображення
      e.target.style.display = 'none';
    }}
  >
    <source src="/videos/122222.MP4" type="video/mp4" />
    <source src="/videos/video123.webm" type="video/webm" />
  </video>  
  {/* Затемнення */}
  <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

  {/* Контент */}
  <div className="relative z-20 text-white px-4">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
      {t("heroTitle")}
    </h1>
    <p className="text-xl max-w-2xl mx-auto mb-8">
      {t("heroSubtitle")}
    </p>
    <Link href="/menu">
      <button className="bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-3xl text-lg shadow-2xl transition-colors">
        {t("viewMenu")}
      </button>
    </Link>
  </div>
</motion.section>

      {/* Популярні страви (без змін) */}
      <section>
        <h2 className="text-3xl font-bold text-brand-dark-chocolate mb-6">{t("popularDishes")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Сезонні пропозиції (без змін) */}
      <section className="bg-brand-light-cream/50 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-brand-dark-chocolate mb-6">{t("seasonalOffers")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonal.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Галерея (без змін) */}
      <section>
        <h2 className="text-3xl font-bold text-brand-dark-chocolate mb-6">{t("gallery")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((src, idx) => (
            <motion.img
              key={idx}
              src={src}
              alt="Interior"
              className="w-full h-40 object-cover rounded-2xl shadow-lg"
              whileHover={{ scale: 1.1 }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400?text=Gallery";
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}