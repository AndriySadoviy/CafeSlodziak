/** Diagnostic: which email env vars exist (no secrets leaked) */
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  return res.status(200).json({
    ORDER_NOTIFICATION_EMAIL: Boolean(process.env.ORDER_NOTIFICATION_EMAIL),
    SMTP_HOST: Boolean(process.env.SMTP_HOST),
    SMTP_USER: Boolean(process.env.SMTP_USER),
    SMTP_PASS: Boolean(process.env.SMTP_PASS),
    SMTP_PORT: process.env.SMTP_PORT || null,
    fallback: "formsubmit (no SMTP required)",
    toDefault: "andriysadoviy8@gmail.com",
  });
}