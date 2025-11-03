// src/controllers/donacionController.js
import { Donacion, Donador, CategoriaDonacion, Postulacion } from "../models/index.js";
import { Op } from "sequelize";

export const crearDonacion = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador) return res.status(403).json({ mensaje: "Solo donadores pueden crear donaciones" });

    const { nombre, descripcion, cantidad, fecha_vencimiento, ubicacion, id_categoria } = req.body;
    if (!nombre || !cantidad) return res.status(400).json({ mensaje: "Faltan datos obligatorios" });

    const nueva = await Donacion.create({
      id_donador: donador.id_donador,
      id_categoria: id_categoria || null,
      nombre,
      descripcion,
      cantidad,
      fecha_vencimiento: fecha_vencimiento || null,
      ubicacion: ubicacion || null,
      estado: "disponible"
    });

    return res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const listarDonaciones = async (req, res) => {
  try {
    const { categoria, ciudad, q, estado } = req.query;
    const where = {};
    if (estado) where.estado = estado;
    if (categoria) where.id_categoria = categoria;
    if (ciudad) where.ubicacion = { [Op.iLike]: `%${ciudad}%` };
    if (q) where.nombre = { [Op.iLike]: `%${q}%` };

    const donaciones = await Donacion.findAll({
      where,
      include: [{ model: Donador, attributes: ["id_donador", "nombre", "tipo", "direccion", "telefono_contacto"] }, { model: CategoriaDonacion, attributes: ["id_categoria", "nombre"] }],
      order: [["id_donacion", "DESC"]],
    });

    return res.json(donaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const donacion = await Donacion.findByPk(id, { include: [{ model: Donador }, { model: CategoriaDonacion }, { model: Postulacion }] });
    if (!donacion) return res.status(404).json({ mensaje: "Donación no encontrada" });
    return res.json(donacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const editarDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;
    const donacion = await Donacion.findByPk(id);
    if (!donacion) return res.status(404).json({ mensaje: "Donación no encontrada" });

    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador || donacion.id_donador !== donador.id_donador) return res.status(403).json({ mensaje: "No autorizado" });

    await donacion.update(req.body);
    return res.json(donacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const eliminarDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;
    const donacion = await Donacion.findByPk(id);
    if (!donacion) return res.status(404).json({ mensaje: "Donación no encontrada" });

    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador || donacion.id_donador !== donador.id_donador) return res.status(403).json({ mensaje: "No autorizado" });

    await donacion.destroy();
    return res.json({ mensaje: "Donación eliminada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
