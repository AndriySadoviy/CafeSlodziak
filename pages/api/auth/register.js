import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body || {};

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Podaj imię, email i hasło.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Hasło musi mieć co najmniej 6 znaków.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      discount: user.discount,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "Ten email jest już zarejestrowany.",
      });
    }

    if (
      error?.message?.includes("Environment variable not found: DATABASE_URL") ||
      error?.message?.includes("Can't reach database") ||
      error?.code === "P1001" ||
      error?.code === "P1003" ||
      error?.code === "P1012"
    ) {
      return res.status(503).json({
        message:
          "Baza danych nie jest skonfigurowana. Ustaw DATABASE_URL (PostgreSQL) w Netlify.",
      });
    }

    return res.status(500).json({
      message: "Rejestracja nie powiodła się. Spróbuj ponownie.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}