import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../lib/store/languageStore";
import InquiryForm from "../components/InquiryForm";
import { occasionMenu } from "../lib/data/catering";

export default function Katering() {
  const { t } = useTranslation();
  const [premium, setPremium] = useState(false);
  const [selections, setSelections] = useState({});

  const setSelection = (sectionId, value) => {
    setSelections((prev) => ({ ...prev, [sectionId]: value }));
  };

  const buildOrderItem = () => {
    const pricePerPerson = premium
      ? occasionMenu.premiumPrice
      : occasionMenu.basePrice;
    const guests = 1;
    return {
      nameKey: "order_katering",
      quantity: 1,
      price: pricePerPerson * guests,
      cakeDetails: {
        type: "katering",
        premium,
        pricePerPerson,
        selections,
      },
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-10">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-3">
          {t("katering_title")}
        </h1>
        <p className="text-gray-600">{t("katering_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setPremium(false)}
          className={`p-6 rounded-3xl border-2 text-left transition ${
            !premium
              ? "border-brand-orange-zest bg-brand-orange-light/20"
              : "border-brand-caramel-mousse/30 bg-white"
          }`}
        >
          <h3 className="text-xl font-bold text-brand-dark-chocolate">
            {t("katering_standard")}
          </h3>
          <p className="text-3xl font-extrabold text-brand-orange-zest mt-2">
            {occasionMenu.basePrice} zł
          </p>
          <p className="text-sm text-gray-600">{t("katering_per_adult")}</p>
        </button>
        <button
          type="button"
          onClick={() => setPremium(true)}
          className={`p-6 rounded-3xl border-2 text-left transition ${
            premium
              ? "border-brand-orange-zest bg-brand-orange-light/20"
              : "border-brand-caramel-mousse/30 bg-white"
          }`}
        >
          <h3 className="text-xl font-bold text-brand-dark-chocolate">
            {t("katering_premium")}
          </h3>
          <p className="text-3xl font-extrabold text-brand-orange-zest mt-2">
            {occasionMenu.premiumPrice} zł
          </p>
          <p className="text-sm text-gray-600">{t("katering_per_adult")}</p>
        </button>
      </div>

      {occasionMenu.sections.map((section) => (
        <section
          key={section.id}
          className="bg-white rounded-3xl p-6 shadow-lg border border-brand-caramel-mousse/20"
        >
          <h2 className="text-lg font-bold text-brand-dark-chocolate mb-3">
            {t(section.nameKey)} ({section.choose} {t("katering_to_choose")})
          </h2>
          <div className="space-y-2">
            {section.options.map((optKey) => (
              <label
                key={optKey}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border ${
                  selections[section.id] === optKey
                    ? "border-brand-orange-zest bg-brand-orange-light/20"
                    : "border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={section.id}
                  checked={selections[section.id] === optKey}
                  onChange={() => setSelection(section.id, optKey)}
                  className="mt-1 accent-brand-orange-zest"
                />
                <span className="text-sm text-gray-700">{t(optKey)}</span>
              </label>
            ))}
          </div>
        </section>
      ))}

      {premium && (
        <section className="bg-white rounded-3xl p-6 shadow-lg border border-brand-caramel-mousse/20">
          <h2 className="text-lg font-bold text-brand-dark-chocolate mb-3">
            {t("katering_premium_dish")}
          </h2>
          <div className="space-y-2">
            {occasionMenu.premiumOptions.map((optKey) => (
              <label
                key={optKey}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border ${
                  selections.premium === optKey
                    ? "border-brand-orange-zest bg-brand-orange-light/20"
                    : "border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="premium"
                  checked={selections.premium === optKey}
                  onChange={() => setSelection("premium", optKey)}
                  className="mt-1 accent-brand-orange-zest"
                />
                <span className="text-sm text-gray-700">{t(optKey)}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="bg-brand-orange-light/20 rounded-3xl p-6">
        <h2 className="font-bold text-brand-dark-chocolate mb-2">{t("katering_cake_title")}</h2>
        <p className="text-sm text-gray-700">{t(occasionMenu.cakeIncluded)}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-brand-dark-chocolate mb-3">
          {t("katering_rules_title")}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {occasionMenu.rules.map((key) => (
            <li key={key} className="flex gap-2">
              <span className="text-brand-orange-zest">•</span>
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center text-sm">
        <Link href="/slony-stol" className="text-brand-orange-zest font-bold hover:underline">
          {t("katering_slony_link")} →
        </Link>
      </div>

      <InquiryForm
        orderType="Katering / Menu okolicznościowe"
        title={t("katering_form_title")}
        buildOrderItem={buildOrderItem}
      />
    </div>
  );
}