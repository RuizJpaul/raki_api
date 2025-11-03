// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verificarToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id_usuario, rol }
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: "Token inválido" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ mensaje: "No autenticado" });
  if (req.usuario.rol !== role) return res.status(403).json({ mensaje: "Acceso denegado" });
  next();
};
