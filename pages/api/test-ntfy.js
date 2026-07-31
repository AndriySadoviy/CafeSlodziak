import { sendOrderEmail } from "../../lib/email/sendOrderEmail";

/** GET /api/test-ntfy — sends a test order notification to ntfy */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await sendOrderEmail({
      customerName: "TEST ntfy",
      customerPhone: "000000000",
      pickupTime: "12:00",
      items: [{ nameKey: "margherita", quantity: 1, price: 30 }],
      comment: "Wiadomosc testowa z /api/test-ntfy",
      total: 30,
      paymentMethod: "test",
      paymentSuccess: false,
    });

    return res.status(200).json({
      ok: result.sent,
      result,
      subscribe: "https://ntfy.sh/cafeslodziak-rzeszow-orders",
      help: "W apce ntfy: Subscribe → cafeslodziak-rzeszow-orders (dokladnie ta nazwa)",
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}