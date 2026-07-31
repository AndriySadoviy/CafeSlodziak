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
    ? "✅ Tak — płatność online OK"
    : "ℹ️ Płatność przy odbiorze (online wyłączona)";

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
    `Metoda (preferowana): ${paymentMethod || "—"}`,
    `Suma: ${total ?? "—"} zł`,
    "",
    `Data: ${new Date().toLocaleString("pl-PL")}`,
  ].join("\n");
}

async function sendViaSmtp(to, subject, text) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return { ok: false, reason: "no_smtp" };
  }

  const useGmail =
    host.includes("gmail") || process.env.SMTP_SERVICE === "gmail";
  const cleanPass = pass.replace(/\s+/g, "");

  const transporter = nodemailer.createTransport(
    useGmail
      ? { service: "gmail", auth: { user, pass: cleanPass } }
      : {
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user, pass: cleanPass },
        }
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `CafeSlodziak <${user}>`,
    to,
    subject,
    text,
  });

  return { ok: true, via: "smtp" };
}

/** Works without SMTP — uses FormSubmit free relay */
async function sendViaFormSubmit(to, subject, text, order) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      name: order.customerName || "Klient",
      phone: order.customerPhone || "—",
      pickupTime: order.pickupTime || "—",
      total: `${order.total ?? "—"} zł`,
      message: text,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `FormSubmit HTTP ${res.status}`);
  }

  return { ok: true, via: "formsubmit", data };
}

/**
 * Sends order notification.
 * 1) SMTP if Netlify has SMTP_* vars
 * 2) else FormSubmit (no SMTP needed) → andriysadoviy8@gmail.com
 *
 * First FormSubmit email may require one-time link confirmation in inbox/spam.
 */
export async function sendOrderEmail(order) {
  const to =
    process.env.ORDER_NOTIFICATION_EMAIL || "andriysadoviy8@gmail.com";
  const text = buildEmailBody(order);
  const subject = `Nowe zamówienie — ${order.customerName || "Gość"} (${
    order.pickupTime || "—"
  })`;

  // 1) SMTP
  try {
    const smtp = await sendViaSmtp(to, subject, text);
    if (smtp.ok) {
      return { sent: true, to, via: "smtp" };
    }
  } catch (err) {
    console.error("SMTP email failed:", err.message);
  }

  // 2) FormSubmit fallback (no Gmail App Password needed)
  try {
    await sendViaFormSubmit(to, subject, text, order);
    return {
      sent: true,
      to,
      via: "formsubmit",
      hint:
        "Jeśli to pierwsze zamówienie — sprawdź skrzynkę (i Spam) i potwierdź FormSubmit linkiem aktywacyjnym.",
    };
  } catch (err) {
    console.error("FormSubmit email failed:", err.message);
    return {
      sent: false,
      reason: "all_failed",
      message: err.message || "Nie udało się wysłać emaila",
      to,
    };
  }
}