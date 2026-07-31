import prisma from "../../lib/prisma";
import { sendOrderEmail } from "../../lib/email/sendOrderEmail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      userId,
      items,
      total,
      pickupTime,
      comment,
      customerName,
      customerPhone,
      paymentMethod,
      paymentSuccess,
    } = req.body || {};

    try {
      const order = await prisma.order.create({
        data: {
          userId: userId || null,
          items: JSON.stringify(items || []),
          total: total || 0,
          pickupTime: pickupTime || "do ustalenia",
          comment: comment || null,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          paymentMethod: paymentMethod || null,
          paymentSuccess: Boolean(paymentSuccess),
          status: "new",
        },
      });

      let emailResult = { sent: false, reason: "not_attempted" };
      try {
        emailResult = await sendOrderEmail({
          customerName,
          customerPhone,
          pickupTime,
          items,
          comment,
          total,
          paymentMethod,
          paymentSuccess: Boolean(paymentSuccess),
        });
      } catch (emailErr) {
        console.error("Order email failed:", emailErr);
        emailResult = {
          sent: false,
          reason: "error",
          message: emailErr.message || "Email send failed",
        };
      }

      return res.status(201).json({
        ...order,
        email: emailResult,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create order" });
    }
  }

  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      const orders = await prisma.order.findMany({
        where: userId ? { userId: parseInt(userId, 10) } : undefined,
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      const parsedOrders = orders.map((order) => ({
        ...order,
        items:
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items,
      }));
      return res.json(parsedOrders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  return res.status(405).end();
}