import nodemailer from "nodemailer";
import pl from "../translations/pl.json";

const getItemLabel = (nameKey) => pl[nameKey] || nameKey;

function buildOrderText(order) {
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
    ? "✅ Płatność online OK"
    : "ℹ️ Płatność przy odbiorze";

  return [
    "🍽️ Nowe zamówienie — CafeSlodziak",
    "",
    `1. Imię: ${customerName || "—"}`,
    `2. Odbiór: ${pickupTime || "—"}`,
    "3. Pozycje:",
    itemsList || "—",
    `4. Uwagi: ${comment || "—"}`,
    `5. Telefon: ${customerPhone || "—"}`,
    `6. Płatność: ${paymentStatus}`,
    `Metoda: ${paymentMethod || "—"}`,
    `Suma: ${total ?? "—"} zł`,
    `Data: ${new Date().toLocaleString("pl-PL")}`,
  ].join("\n");
}

/** ntfy.sh — works without any Netlify secrets (phone push) */
async function sendViaNtfy(subject, text) {
  const topic =
    process.env.NTFY_TOPIC || "cafeslodziak-rzeszow-orders";

  const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: "POST",
    headers: {
      Title: subject.slice(0, 120),
      Priority: "high",
      Tags: "bell,hamburger",
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: text,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ntfy HTTP ${res.status} ${errText}`);
  }
  return { ok: true, via: "ntfy", topic };
}

async function sendViaTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: "no_telegram" };

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 4000) }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram HTTP ${res.status}`);
  }
  return { ok: true, via: "telegram" };
}

async function sendViaSmtp(to, subject, text) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return { ok: false, reason: "no_smtp" };

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

async function sendViaFormSubmit(to, subject, text, order) {
  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        name: order.customerName || "Klient",
        phone: order.customerPhone || "—",
        message: text,
      }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === "false" || data.success === false) {
    throw new Error(data.message || `FormSubmit HTTP ${res.status}`);
  }
  return { ok: true, via: "formsubmit" };
}

export async function sendOrderEmail(order) {
  const to =
    process.env.ORDER_NOTIFICATION_EMAIL || "andriysadoviy8@gmail.com";
  const text = buildOrderText(order);
  const subject = `Nowe zamówienie — ${order.customerName || "Gość"} (${
    order.pickupTime || "—"
  })`;

  const channels = [];
  const errors = [];

  // 1) ntfy — always try (works without env setup)
  try {
    const ntfy = await sendViaNtfy(subject, text);
    if (ntfy.ok) channels.push(`ntfy:${ntfy.topic}`);
  } catch (err) {
    console.error("ntfy failed:", err.message);
    errors.push(`ntfy: ${err.message}`);
  }

  // 2) Telegram (optional env)
  try {
    const tg = await sendViaTelegram(text);
    if (tg.ok) channels.push("telegram");
  } catch (err) {
    console.error("Telegram failed:", err.message);
    errors.push(`telegram: ${err.message}`);
  }

  // 3) SMTP Gmail (optional env)
  try {
    const smtp = await sendViaSmtp(to, subject, text);
    if (smtp.ok) channels.push("smtp");
  } catch (err) {
    console.error("SMTP failed:", err.message);
    errors.push(`smtp: ${err.message}`);
  }

  // 4) FormSubmit (optional, often needs activation)
  try {
    await sendViaFormSubmit(to, subject, text, order);
    channels.push("formsubmit");
  } catch (err) {
    console.error("FormSubmit failed:", err.message);
    errors.push(`formsubmit: ${err.message}`);
  }

  if (channels.length > 0) {
    return {
      sent: true,
      to,
      via: channels.join("+"),
      ntfyTopic: process.env.NTFY_TOPIC || "cafeslodziak-rzeszow-orders",
    };
  }

  return {
    sent: false,
    reason: "all_failed",
    message: errors.join(" | "),
    to,
  };
}