import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'PATCH') {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    return res.json(order);
  }
  res.status(405).end();
}