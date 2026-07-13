import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../lib/store/languageStore";
import InquiryForm from "../components/InquiryForm";
import ServiceCard from "../components/ServiceCard";
import {
  birthdayPackages,
  snackVariants,
  birthdayExtras,
  birthdayRules,
  weekendSlots,
} from "../lib/data/birthday";

export default function Urodziny() {
  const { t } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const toggleExtra = (id) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const buildOrderItem = () => {
    const pkg = birthdayPackages.find((p) => p.id === selectedPackage);
    const snack = snackVariants.find((s) => s.id === selectedSnack);
    const extras = birthdayExtras.filter((e) => selectedExtras.includes(e.id));
    const price =
      (pkg?.priceWeekend || 0) + (snack?.price || 0) +
      extras.reduce((sum, e) => sum + e.price, 0);

    return {
      nameKey: "order_urodziny",
      quantity: 1,
      price,
      cakeDetails: {
        package: pkg?.id,
        snack: snack?.id,
        extras: extras.map((e) => t(e.nameKey)),
        type: "urodziny",
      },
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-10">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-3">
          {t("urodziny_title")}
        </h1>
        <p className="text-gray-600">{t("urodziny_subtitle")}</p>
        <p className="text-sm text-brand-orange-zest font-semibold mt-2">
          {t("urodziny_min_children")}
        </p>
      </div>

      <section className="bg-white rounded-3xl p-6 shadow-lg border border-brand-caramel-mousse/20">
        <h2 className="text-xl font-bold text-brand-dark-chocolate mb-4">
          {t("urodziny_rules_title")}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {birthdayRules.map((key) => (
            <li key={key} className="flex gap-2">
              <span className="text-brand-orange-zest">•</span>
              {t(key)}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {weekendSlots.map((slot) => (
            <span
              key={slot}
              className="px-3 py-1 bg-brand-orange-light/40 rounded-xl text-sm font-medium"
            >
              {slot}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4">
          {t("urodziny_packages_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {birthdayPackages.map((pkg) => (
            <div key={pkg.id} className="space-y-3">
              <ServiceCard
                title={t(pkg.nameKey)}
                meta={`${t("urodziny_weekday")}: ${pkg.priceWeekday} zł | ${t("urodziny_weekend")}: ${pkg.priceWeekend} zł`}
                selected={selectedPackage === pkg.id}
                onSelect={() => setSelectedPackage(pkg.id)}
              />
              {selectedPackage === pkg.id && (
                <ul className="text-sm text-gray-600 space-y-1 pl-4">
                  {t(pkg.featuresKey)
                    .split("|")
                    .map((f, i) => (
                      <li key={i}>✓ {f.trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4">
          {t("urodziny_snacks_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {snackVariants.map((variant) => (
            <div key={variant.id}>
              <ServiceCard
                title={t(variant.nameKey)}
                price={variant.price}
                meta={`${t("urodziny_per_child")}`}
                selected={selectedSnack === variant.id}
                onSelect={() => setSelectedSnack(variant.id)}
              />
              {selectedSnack === variant.id && (
                <ul className="text-xs text-gray-600 mt-2 space-y-1 pl-2">
                  {t(variant.itemsKey)
                    .split("|")
                    .map((item, i) => (
                      <li key={i}>• {item.trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4">
          {t("urodziny_extras_title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {birthdayExtras.map((extra) => (
            <ServiceCard
              key={extra.id}
              title={t(extra.nameKey)}
              price={extra.price}
              selected={selectedExtras.includes(extra.id)}
              onSelect={() => toggleExtra(extra.id)}
            />
          ))}
        </div>
      </section>

      <div className="bg-brand-orange-light/30 rounded-2xl p-4 text-center text-sm">
        <p>{t("urodziny_tables_hint")}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-3">
          <Link href="/cake-order" className="text-brand-orange-zest font-bold hover:underline">
            {t("slodki_stol_title")} →
          </Link>
          <Link href="/slony-stol" className="text-brand-orange-zest font-bold hover:underline">
            {t("slony_stol_title")} →
          </Link>
        </div>
      </div>

      <InquiryForm
        orderType="Urodziny"
        title={t("urodziny_form_title")}
        buildOrderItem={buildOrderItem}
      />
    </div>
  );
}