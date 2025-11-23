// Obtener perfil del usuario autenticado
export const perfil = async (req, res) => {
  try {
    const { id_usuario, rol } = req.usuario;
    const usuario = await Usuario.findByPk(id_usuario, { attributes: ['id_usuario', 'username', 'correo', 'rol', 'telefono'] });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    let perfil = null;
    if (rol === 'donador') {
      perfil = await Donador.findOne({ where: { id_usuario }, attributes: { exclude: ['id_usuario'] } });
    } else {
      perfil = await Beneficiario.findOne({ where: { id_usuario }, attributes: { exclude: ['id_usuario'] } });
    }

    return res.json({
      usuario,
      perfil
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { Usuario, Donador, Beneficiario } from "../models/index.js";

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

export const registrar = async (req, res) => {
  try {
    // Adaptar los campos al Figma
    const {
      username,
      correo,
      password,
      rol,
      nombre,
      tipo_entidad,
      direccion,
      ruc,
      persona_contacto,
      telefono,
      capacidad_atencion
    } = req.body;

    // Validaciones básicas
    if (!correo || !password || !rol) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    if (!["donador", "beneficiario"].includes(rol)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ error: "Correo ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ username, correo, password: hashed, telefono, rol });

    let perfil = null;
    if (rol === "donador") {
      perfil = await Donador.create({
        id_usuario: usuario.id_usuario,
        nombre: nombre || username,
        tipo_entidad: tipo_entidad || null,
        direccion: direccion || null,
        ruc: ruc || null,
        persona_contacto: persona_contacto || null,
        telefono: telefono || null
      });
    } else {
      perfil = await Beneficiario.create({
        id_usuario: usuario.id_usuario,
        nombre: nombre || username,
        tipo_entidad: tipo_entidad || null,
        direccion: direccion || null,
        capacidad_atencion: capacidad_atencion ? parseInt(capacidad_atencion, 10) : null,
        persona_contacto: persona_contacto || null,
        telefono: telefono || null
      });
    }

    const token = signToken({ id_usuario: usuario.id_usuario, rol: usuario.rol });
    // Respuesta adaptada al Figma
    return res.status(201).json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        correo: usuario.correo,
        rol: usuario.rol,
        perfil
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ error: "Correo y contraseña requeridos" });

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: "Credenciales incorrectas" });

    let perfil = null;
    if (usuario.rol === "donador") perfil = await Donador.findOne({ where: { id_usuario: usuario.id_usuario } });
    else perfil = await Beneficiario.findOne({ where: { id_usuario: usuario.id_usuario } });

    const token = signToken({ id_usuario: usuario.id_usuario, rol: usuario.rol });
    // Respuesta adaptada al Figma
    return res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        correo: usuario.correo,
        rol: usuario.rol,
        perfil
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
