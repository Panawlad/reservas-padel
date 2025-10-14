import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateAccessToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
    });

    // Generar token
    const token = generateAccessToken(newUser.id);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en signup:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email y contraseña requeridos" });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = generateAccessToken(user.id);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
