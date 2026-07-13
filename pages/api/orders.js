import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, items, total, pickupTime, comment } = req.body;
    try {
      const order = await prisma.order.create({
        data: {
          userId: userId || null,
          items: JSON.stringify(items),
          total,
          pickupTime,
          comment: comment || null,   // зберігаємо коментар
          status: 'new',
        },
      });
      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    const orders = await prisma.order.findMany({
      where: userId ? { userId: parseInt(userId) } : undefined,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    const parsedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }));
    return res.json(parsedOrders);
  }

  res.status(405).end();
}