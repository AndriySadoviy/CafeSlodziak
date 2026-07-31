import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { status } = req.body || {};

    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update status" });
  }
}