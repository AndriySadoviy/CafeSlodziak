import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Podaj email i hasło." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło." });
    }

    const token = Buffer.from(`${user.email}:${Date.now()}`).toString("base64");
    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax`);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      discount: user.discount,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error?.message?.includes("DATABASE_URL") ||
      error?.code === "P1001" ||
      error?.code === "P1003"
    ) {
      return res.status(503).json({
        message:
          "Baza danych nie jest skonfigurowana. Ustaw DATABASE_URL (PostgreSQL) w Netlify.",
      });
    }

    return res.status(500).json({
      message: "Logowanie nie powiodło się. Spróbuj ponownie.",
    });
  }
}