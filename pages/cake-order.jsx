import { useState } from "react";
import { useTranslation } from "../lib/store/languageStore";
import InquiryForm from "../components/InquiryForm";
import ServiceCard from "../components/ServiceCard";
import {
  spongeCakes,
  torciki,
  cakeExtras,
  creamSwaps,
  fruitMousses,
  sweetTableExtras,
} from "../lib/data/cakes";

export default function CakeOrder() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("torciki");
  const [selectedCake, setSelectedCake] = useState(null);
  const [selectedSponge, setSelectedSponge] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMousse, setSelectedMousse] = useState("malina");
  const [childName, setChildName] = useState("");

  const tabs = [
    { key: "torciki", label: t("cake_tab_torciki") },
    { key: "sponge", label: t("cake_tab_sponge") },
    { key: "extras", label: t("cake_tab_extras") },
  ];

  const buildOrderItem = () => {
    let nameKey = "cake_custom";
    let price = 0;
    let details = { childName, mousse: selectedMousse };

    if (tab === "torciki" && selectedCake) {
      const cake = torciki.find((c) => c.id === selectedCake);
      nameKey = `cake_${selectedCake}`;
      price = cake?.price || 0;
      details.cakeName = t(cake.nameKey);
      details.diameter = "25 cm";
    } else if (tab === "sponge" && selectedSponge && selectedSize) {
      const sponge = spongeCakes.find((c) => c.id === selectedSponge);
      const size = sponge?.sizes.find((s) => s.portions === selectedSize);
      nameKey = `cake_${selectedSponge}`;
      price = size?.price || 0;
      details.cakeName = t(sponge.nameKey);
      details.portions = size?.portions;
      details.diameter = size?.diameter;
    }

    return {
      nameKey,
      quantity: 1,
      price,
      cakeDetails: details,
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-3">
          {t("slodki_stol_title")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("slodki_stol_desc")}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-2xl text-sm sm:text-base font-semibold transition ${
              tab === item.key
                ? "bg-brand-orange-zest text-white"
                : "bg-white text-brand-dark-chocolate border border-brand-caramel-mousse"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "torciki" && (
        <section className="space-y-3">
          <p className="text-sm text-brand-caramel-mousse font-medium text-center">
            {t("cake_torciki_note")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {torciki.map((cake) => (
              <ServiceCard
                key={cake.id}
                title={t(cake.nameKey)}
                description={t(cake.descKey)}
                price={cake.price}
                selected={selectedCake === cake.id}
                onSelect={() => setSelectedCake(cake.id)}
              />
            ))}
          </div>
        </section>
      )}

      {tab === "sponge" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spongeCakes.map((cake) => (
              <div key={cake.id} className="space-y-3">
                <ServiceCard
                  title={t(cake.nameKey)}
                  description={t(cake.descKey)}
                  selected={selectedSponge === cake.id}
                  onSelect={() => {
                    setSelectedSponge(cake.id);
                    setSelectedSize(null);
                  }}
                />
                {selectedSponge === cake.id && (
                  <div className="space-y-2 pl-2">
                    {cake.sizes.map((size) => (
                      <ServiceCard
                        key={size.portions}
                        title={`${size.portions} ${t("cake_portions")} (ø ${size.diameter})`}
                        price={size.price}
                        selected={selectedSize === size.portions}
                        onSelect={() => setSelectedSize(size.portions)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-2">
              {t("cake_mousse_choose")}
            </label>
            <div className="flex flex-wrap gap-2">
              {fruitMousses.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMousse(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    selectedMousse === m
                      ? "bg-brand-orange-zest text-white"
                      : "bg-white border border-brand-caramel-mousse"
                  }`}
                >
                  {t(`mousse_${m}`)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "extras" && (
        <section className="space-y-6">
          <div>
            <h3 className="font-bold text-brand-dark-chocolate mb-3">{t("cake_extras_title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cakeExtras.map((e) => (
                <div key={e.id} className="bg-white p-4 rounded-2xl border border-brand-caramel-mousse/20">
                  <span className="font-medium">{t(e.nameKey)}</span>
                  <span className="float-right text-brand-orange-zest font-bold">+{e.price} zł</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark-chocolate mb-3">{t("cake_cream_swap_title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {creamSwaps.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-brand-caramel-mousse/20">
                  <span className="font-medium">{t(c.nameKey)}</span>
                  <span className="float-right text-brand-orange-zest font-bold">+{c.price} zł</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark-chocolate mb-3">{t("cake_sweet_extras_title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sweetTableExtras.map((e) => (
                <div key={e.id} className="bg-white p-4 rounded-2xl border border-brand-caramel-mousse/20">
                  <span className="font-medium">{t(e.nameKey)}</span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {e.price} zł / min. {e.minQty} szt.
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">{t("cake_decoration_note")}</p>
          <p className="text-sm text-gray-500">{t("cake_wedding_note")}</p>
        </section>
      )}

      {(tab === "torciki" || tab === "sponge") && (
        <InquiryForm
          orderType="Słodki stół / Tort"
          title={t("cake_form_title")}
          buildOrderItem={buildOrderItem}
        >
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              {t("name")} ({t("cake_for_child")})
            </label>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
              placeholder={t("cake_child_placeholder")}
            />
          </div>
          {selectedCake && tab === "torciki" && (
            <p className="text-sm text-brand-dark-chocolate bg-brand-orange-light/20 p-3 rounded-xl">
              {t("cake_selected")}: <strong>{t(torciki.find((c) => c.id === selectedCake)?.nameKey)}</strong>
            </p>
          )}
          {selectedSponge && selectedSize && tab === "sponge" && (
            <p className="text-sm text-brand-dark-chocolate bg-brand-orange-light/20 p-3 rounded-xl">
              {t("cake_selected")}: <strong>{t(spongeCakes.find((c) => c.id === selectedSponge)?.nameKey)}</strong>
              {" "}– {selectedSize} {t("cake_portions")}, {t(`mousse_${selectedMousse}`)}
            </p>
          )}
        </InquiryForm>
      )}
    </div>
  );
}