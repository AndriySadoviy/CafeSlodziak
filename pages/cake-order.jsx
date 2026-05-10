import { useState } from "react";
import { useTranslation } from "../lib/store/languageStore";

export default function CakeOrder() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    flavor: "vanilla",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 500);
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-brand-orange-zest">{t("orderSuccess")}</h1>
        <p className="mt-4 text-brand-dark-chocolate">{t("orderSuccessDesc")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-brand-dark-chocolate mb-6">{t("cakeFormTitle")}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl space-y-5 border border-brand-caramel-mousse/20"
      >
        <input
          name="name"
          placeholder={t("name")}
          value={form.name}
          onChange={handleChange}
          className="w-full border-brand-caramel-mousse"
          required
        />
        <input
          name="phone"
          placeholder={t("phone")}
          value={form.phone}
          onChange={handleChange}
          className="w-full border-brand-caramel-mousse"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border-brand-caramel-mousse"
          required
        />
        <select
          name="flavor"
          value={form.flavor}
          onChange={handleChange}
          className="w-full border-brand-caramel-mousse"
        >
          <option value="vanilla">{t("vanilla") || "Vanilla"}</option>
          <option value="chocolate">{t("chocolate") || "Chocolate"}</option>
          <option value="berry">{t("berry") || "Berry"}</option>
          <option value="custom">{t("custom") || "Custom"}</option>
        </select>
        <textarea
          name="message"
          placeholder={t("message")}
          value={form.message}
          onChange={handleChange}
          rows="4"
          className="w-full border-brand-caramel-mousse"
        />
        <button
          type="submit"
          className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xl transition-colors"
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}