import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "../lib/store/languageStore";

const SUBCATEGORY_ORDER = {
  pizza: ["pizza_red", "pizza_white", "pizza_kids"],
  drinks: [
    "drinks_hot_coffee",
    "drinks_tea",
    "drinks_cold",
    "drinks_lemonade",
    "drinks_kids",
    "drinks_cold_coffee",
  ],
};

export default function Menu() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { key: "all", label: t("all") },
    { key: "breakfast", label: t("breakfast") },
    { key: "pizza", label: t("pizza") },
    { key: "pierogi", label: t("pierogi") },
    { key: "salads", label: t("salads") },
    { key: "panini", label: t("panini") },
    { key: "pasta", label: t("pasta") },
    { key: "kids", label: t("kids") },
    { key: "drinks", label: t("drinks") },
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return selected === "all"
      ? products
      : products.filter((p) => p.category === selected);
  }, [products, selected]);

  const grouped = useMemo(() => {
    const order = SUBCATEGORY_ORDER[selected];
    if (!order) return [{ key: null, items: filtered }];

    const groups = order.map((sub) => ({
      key: sub,
      items: filtered.filter((p) => p.subcategory === sub),
    }));

    const ungrouped = filtered.filter((p) => !p.subcategory);
    if (ungrouped.length) groups.push({ key: null, items: ungrouped });

    return groups.filter((g) => g.items.length > 0);
  }, [filtered, selected]);

  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-2">
        {t("menu")}
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-2">{t("heroSubtitle")}</p>
      <p className="text-sm text-brand-caramel-mousse mb-6">{t("orderAtBar")}</p>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              selected === cat.key
                ? "bg-brand-orange-zest text-white shadow-md"
                : "bg-white text-brand-dark-chocolate border-2 border-brand-caramel-mousse"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {selected === "breakfast" && (
        <p className="mb-6 text-brand-dark-chocolate bg-brand-orange-light/30 px-4 py-3 rounded-2xl text-sm font-medium">
          {t("breakfastHours")}
        </p>
      )}

      {loading ? (
        <div className="text-center text-2xl py-20 text-brand-dark-chocolate">
          Loading...
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.key || "default"}>
              {group.key && (
                <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4 pb-2 border-b-2 border-brand-orange-zest/30">
                  {t(group.key)}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}