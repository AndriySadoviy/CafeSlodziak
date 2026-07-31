import nodemailer from "nodemailer";
import pl from "../translations/pl.json";

const getItemLabel = (nameKey) => pl[nameKey] || nameKey;

/** HTTP headers must be Latin-1 — strip emoji/unicode dashes */
function asciiHeader(value, max = 120) {
  return String(value || "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

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
    ? "Platnosc online OK"
    : "Platnosc przy odbiorze";

  return [
    "NOWE ZAMOWIENIE - CafeSlodziak",
    "",
    `1. Imie: ${customerName || "-"}`,
    `2. Odbior: ${pickupTime || "-"}`,
    "3. Pozycje:",
    itemsList || "-",
    `4. Uwagi: ${comment || "-"}`,
    `5. Telefon: ${customerPhone || "-"}`,
    `6. Platnosc: ${paymentStatus}`,
    `Metoda: ${paymentMethod || "-"}`,
    `Suma: ${total ?? "-"} zl`,
    `Data: ${new Date().toLocaleString("pl-PL")}`,
  ].join("\n");
}

/** ntfy.sh push — topic works without Netlify secrets */
async function sendViaNtfy(subject, text) {
  const topic = process.env.NTFY_TOPIC || "cafeslodziak-rzeszow-orders";

  // JSON publish must go to https://ntfy.sh/ (root), topic inside body
  // See: https://docs.ntfy.sh/publish/#publish-as-json
  const res = await fetch("https://ntfy.sh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      title: asciiHeader(subject, 100) || "CafeSlodziak - nowe zamowienie",
      message: String(text || "").slice(0, 3900),
      priority: 5,
      tags: ["bell", "hamburger"],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ntfy HTTP ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => ({}));
  return { ok: true, via: "ntfy", topic, id: data.id };
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
    subject: asciiHeader(subject, 150) || "Nowe zamowienie CafeSlodziak",
    text,
  });
  return { ok: true, via: "smtp" };
}

export async function sendOrderEmail(order) {
  const to =
    process.env.ORDER_NOTIFICATION_EMAIL || "andriysadoviy8@gmail.com";
  const text = buildOrderText(order);
  const subject = `Nowe zamowienie - ${order.customerName || "Gosc"} (${
    order.pickupTime || "-"
  })`;

  const channels = [];
  const errors = [];

  // 1) ntfy first (phone app)
  try {
    const ntfy = await sendViaNtfy(subject, text);
    if (ntfy.ok) channels.push(`ntfy:${ntfy.topic}`);
  } catch (err) {
    console.error("ntfy failed:", err.message);
    errors.push(`ntfy: ${err.message}`);
  }

  // 2) Telegram optional
  try {
    const tg = await sendViaTelegram(text);
    if (tg.ok) channels.push("telegram");
  } catch (err) {
    console.error("Telegram failed:", err.message);
    errors.push(`telegram: ${err.message}`);
  }

  // 3) SMTP optional
  try {
    const smtp = await sendViaSmtp(to, subject, text);
    if (smtp.ok) channels.push("smtp");
  } catch (err) {
    console.error("SMTP failed:", err.message);
    errors.push(`smtp: ${err.message}`);
  }

  if (channels.length > 0) {
    return {
      sent: true,
      to,
      via: channels.join("+"),
      ntfyTopic: process.env.NTFY_TOPIC || "cafeslodziak-rzeszow-orders",
      ntfySubscribe: `https://ntfy.sh/${process.env.NTFY_TOPIC || "cafeslodziak-rzeszow-orders"}`,
    };
  }

  return {
    sent: false,
    reason: "all_failed",
    message: errors.join(" | "),
    to,
    ntfyTopic: "cafeslodziak-rzeszow-orders",
  };
}