import nodemailer from "nodemailer";
import pl from "../translations/pl.json";

const getItemLabel = (nameKey) => pl[nameKey] || nameKey;

function buildEmailBody(order) {
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

  const parsedItems =
    typeof items === "string" ? JSON.parse(items) : items || [];

  const itemsList = parsedItems
    .map(
      (item) =>
        `• ${getItemLabel(item.nameKey)} × ${item.quantity} — ${
          (item.price || 0) * (item.quantity || 1)
        } zł`
    )
    .join("\n");

  const paymentStatus = paymentSuccess
    ? "✅ Tak — płatność zakończona pomyślnie"
    : "❌ Nie — płatność nieudana / zapytanie";

  return [
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
    `Suma: ${total ?? "—"} zł`,
    "",
    `Data: ${new Date().toLocaleString("pl-PL")}`,
  ].join("\n");
}

/**
 * Sends order notification email.
 * Requires Netlify env: SMTP_HOST, SMTP_USER, SMTP_PASS
 * Optional: ORDER_NOTIFICATION_EMAIL, SMTP_PORT, SMTP_FROM
 */
export async function sendOrderEmail(order) {
  const to =
    process.env.ORDER_NOTIFICATION_EMAIL || "andriysadoviy8@gmail.com";
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      "SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS on Netlify"
    );
    return {
      sent: false,
      reason: "no_smtp",
      message:
        "Brak SMTP w Netlify (SMTP_HOST, SMTP_USER, SMTP_PASS). Email nie został wysłany.",
    };
  }

  const text = buildEmailBody(order);
  const subject = `Nowe zamówienie — ${order.customerName || "Gość"} (${
    order.pickupTime || "—"
  })`;

  // Gmail: service "gmail" is more reliable on Netlify than raw host/port
  const useGmail = host.includes("gmail") || process.env.SMTP_SERVICE === "gmail";
  const transporter = nodemailer.createTransport(
    useGmail
      ? {
          service: "gmail",
          auth: { user, pass: pass.replace(/\s+/g, "") },
        }
      : {
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user, pass: pass.replace(/\s+/g, "") },
        }
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `CafeSlodziak <${user}>`,
    to,
    subject,
    text,
  });

  return { sent: true, to };
}