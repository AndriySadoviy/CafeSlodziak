import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "../lib/store/languageStore";

export default function Menu() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
  { key: "all", label: t("all") },
  { key: "breakfast", label: t("breakfast") },
  { key: "pizza", label: t("pizza") },
  { key: "salads", label: t("salads") },
  { key: "panini", label: t("panini") },
  { key: "pasta", label: t("pasta") },
  { key: "kids", label: t("kids") },
  { key: "drinks", label: t("drinks") },
  { key: "desserts", label: t("desserts") },
];
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered =
    selected === "all" ? products : products.filter((p) => p.category === selected);

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark-chocolate mb-2">{t("menu")}</h1>
      <p className="text-lg text-gray-600 mb-8">{t("heroSubtitle")}</p>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all ${
              selected === cat.key
                ? "bg-brand-orange-zest text-white shadow-lg scale-105"
                : "bg-white text-brand-dark-chocolate border-2 border-brand-caramel-mousse hover:bg-brand-caramel-mousse/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-2xl py-20 text-brand-dark-chocolate">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}