import nodemailer from "nodemailer";
import pl from "../translations/pl.json";

const getItemLabel = (nameKey) => pl[nameKey] || nameKey;

export async function sendOrderEmail(order) {
  const {
    customerName,
    customerPhone,
    pickupTime,
    items,
    comment,
    total,
    paymentMethod,
    paymentSuccess,
  } = order;

  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("ORDER_NOTIFICATION_EMAIL not set — skipping email");
    return { sent: false, reason: "no_recipient" };
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn("SMTP not configured — skipping email");
    return { sent: false, reason: "no_smtp" };
  }

  const parsedItems =
    typeof items === "string" ? JSON.parse(items) : items || [];

  const itemsList = parsedItems
    .map(
      (item) =>
        `• ${getItemLabel(item.nameKey)} × ${item.quantity} — ${item.price * item.quantity} zł`
    )
    .join("\n");

  const paymentStatus = paymentSuccess
    ? "✅ Tak — płatność zakończona pomyślnie"
    : "❌ Nie — płatność nieudana";

  const text = [
    "Nowe zamówienie — CafeSlodziak",
    "",
    `1. Imię klienta: ${customerName || "—"}`,
    `2. Godzina odbioru: ${pickupTime || "—"}`,
    "3. Zamówione pozycje:",
    itemsList || "—",
    `4. Uwagi / dodatki: ${comment || "—"}`,
    `5. Telefon klienta: ${customerPhone || "—"}`,
    `6. Status płatności: ${paymentStatus}`,
    "",
    `Metoda płatności: ${paymentMethod || "—"}`,
    `Suma: ${total} zł`,
    "",
    `Data: ${new Date().toLocaleString("pl-PL")}`,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject: `Nowe zamówienie — ${customerName || "Gość"} (${pickupTime})`,
    text,
  });

  return { sent: true };
}