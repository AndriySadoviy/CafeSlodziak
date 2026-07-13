import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Простий токен (можна замінити на JWT пізніше)
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64');
  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`);
res.json({
  id: user.id,
  name: user.name,
  email: user.email,
  discount: user.discount,
  role: user.role,    // ← ОБОВ'ЯЗКОВО
  token,
});
}