// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Usuario, Donador, Beneficiario } from "../models/index.js";

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

export const registrar = async (req, res) => {
  try {
    const { username, correo, password, telefono, rol, nombre, tipo, direccion, ruc, persona_contacto, telefono_contacto, capacidad } = req.body;

    if (!username || !correo || !password || !rol) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    if (!["donador", "beneficiario"].includes(rol)) {
      return res.status(400).json({ mensaje: "Rol inválido" });
    }

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ mensaje: "Correo ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ username, correo, password: hashed, telefono, rol });

    if (rol === "donador") {
      await Donador.create({
        id_usuario: usuario.id_usuario,
        nombre: nombre || username,
        tipo: tipo || null,
        direccion: direccion || null,
        ruc: ruc || null,
        persona_contacto: persona_contacto || null,
        telefono_contacto: telefono_contacto || telefono || null,
      });
    } else {
      await Beneficiario.create({
        id_usuario: usuario.id_usuario,
        nombre: nombre || username,
        tipo: tipo || null,
        direccion: direccion || null,
        capacidad: capacidad ? parseInt(capacidad, 10) : null,
        persona_contacto: persona_contacto || null,
        telefono_contacto: telefono_contacto || telefono || null,
      });
    }

    const token = signToken({ id_usuario: usuario.id_usuario, rol: usuario.rol });
    return res.status(201).json({ mensaje: "Registro exitoso", token, usuario: { id_usuario: usuario.id_usuario, username: usuario.username, correo: usuario.correo, rol: usuario.rol } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ mensaje: "Credenciales incorrectas" });

    let perfil = null;
    if (usuario.rol === "donador") perfil = await Donador.findOne({ where: { id_usuario: usuario.id_usuario } });
    else perfil = await Beneficiario.findOne({ where: { id_usuario: usuario.id_usuario } });

    const token = signToken({ id_usuario: usuario.id_usuario, rol: usuario.rol });
    return res.json({ mensaje: "Login exitoso", token, usuario: { id_usuario: usuario.id_usuario, username: usuario.username, correo: usuario.correo, rol: usuario.rol, perfil } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
