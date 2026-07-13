import { useState } from "react";
import useAuthStore from "../lib/store/authStore";
import { useTranslation } from "../lib/store/languageStore";

export default function InquiryForm({
  orderType,
  title,
  children,
  buildOrderItem,
  onSuccess,
}) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const orderItem = buildOrderItem(form);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          items: [orderItem],
          total: orderItem.price || 0,
          pickupTime: form.date || "do ustalenia",
          comment: [
            `Typ: ${orderType}`,
            form.name && `Kontakt: ${form.name}`,
            form.phone && `Tel: ${form.phone}`,
            form.email && `Email: ${form.email}`,
            form.guests && `Goście: ${form.guests}`,
            form.message && `Uwagi: ${form.message}`,
          ]
            .filter(Boolean)
            .join(" | "),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      onSuccess?.();
    } catch {
      alert(t("inquiry_error"));
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-lg border border-brand-caramel-mousse/20">
        <h2 className="text-2xl font-bold text-brand-orange-zest">{t("orderSuccess")}</h2>
        <p className="mt-3 text-brand-dark-chocolate">{t("inquiry_success")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-brand-caramel-mousse/20 p-6 md:p-8">
      {title && (
        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-6 text-center">
          {title}
        </h2>
      )}
      {children}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              {t("inquiry_name")} *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              {t("phone")} *
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              {t("date")} *
            </label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
              {t("inquiry_guests")}
            </label>
            <input
              name="guests"
              type="number"
              min="1"
              value={form.guests}
              onChange={handleChange}
              className="w-full border border-brand-caramel-mousse rounded-xl p-3"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark-chocolate mb-1">
            {t("message")}
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="3"
            className="w-full border border-brand-caramel-mousse rounded-xl p-3"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-lg transition-colors disabled:opacity-50"
        >
          {sending ? t("inquiry_sending") : t("inquiry_send")}
        </button>
        <p className="text-sm text-gray-500 text-center">{t("inquiry_note")}</p>
      </form>
    </div>
  );
}