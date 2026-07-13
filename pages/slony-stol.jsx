import { useState } from "react";
import { useTranslation } from "../lib/store/languageStore";
import InquiryForm from "../components/InquiryForm";
import ServiceCard from "../components/ServiceCard";
import { savoryCategories } from "../lib/data/savoryTable";

export default function SlonyStol() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);

  const toggleItem = (catId, item) => {
    const key = `${catId}:${item.id}`;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const buildOrderItem = () => {
    const items = selected.map((key) => {
      const [catId, itemId] = key.split(":");
      const cat = savoryCategories.find((c) => c.id === catId);
      const item = cat?.items.find((i) => i.id === itemId);
      return {
        name: t(item.nameKey),
        price: item?.price,
        minQty: item?.minQty,
        unit: item?.unit,
      };
    });
    const total = items.reduce((sum, i) => sum + (i.price || 0), 0);
    return {
      nameKey: "order_slony_stol",
      quantity: 1,
      price: total,
      cakeDetails: { items, type: "slony_stol" },
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-3">
          {t("slony_stol_title")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("slony_stol_desc")}</p>
      </div>

      {savoryCategories.map((category) => (
        <section key={category.id}>
          <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4 pb-2 border-b-2 border-brand-orange-zest/30">
            {t(category.nameKey)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.items.map((item) => (
              <ServiceCard
                key={item.id}
                title={t(item.nameKey)}
                price={item.price}
                meta={`min. ${item.minQty} ${item.unit}`}
                selected={selected.includes(`${category.id}:${item.id}`)}
                onSelect={() => toggleItem(category.id, item)}
              />
            ))}
          </div>
        </section>
      ))}

      <InquiryForm
        orderType="Słony stół"
        title={t("slony_stol_form_title")}
        buildOrderItem={buildOrderItem}
      >
        {selected.length > 0 ? (
          <p className="text-sm text-brand-dark-chocolate">
            {t("slony_stol_selected")}: {selected.length} {t("slony_stol_items")}
          </p>
        ) : (
          <p className="text-sm text-gray-500">{t("slony_stol_select_hint")}</p>
        )}
      </InquiryForm>
    </div>
  );
}