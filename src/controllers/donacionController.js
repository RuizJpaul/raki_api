// src/controllers/donacionController.js
import { Donacion, Donador, CategoriaDonacion, Postulacion } from "../models/index.js";
import { Op } from "sequelize";

export const crearDonacion = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador) return res.status(403).json({ mensaje: "Solo donadores pueden crear donaciones" });

    // Adaptar los campos y respuesta al Figma
    const { nombre, descripcion, cantidad, fecha_vencimiento, ubicacion, id_categoria } = req.body;
    if (!nombre || !cantidad) return res.status(400).json({ error: "Faltan datos obligatorios" });

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

    // Respuesta adaptada al Figma
    return res.status(201).json({
      id_donacion: nueva.id_donacion,
      nombre: nueva.nombre,
      descripcion: nueva.descripcion,
      cantidad: nueva.cantidad,
      fecha_vencimiento: nueva.fecha_vencimiento,
      ubicacion: nueva.ubicacion,
      estado: nueva.estado,
      id_categoria: nueva.id_categoria,
      id_donador: nueva.id_donador
    });
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

    // Adaptar la respuesta al Figma
    const donaciones = await Donacion.findAll({
      where,
      include: [
        { model: Donador, attributes: ["id_donador", "nombre", "tipo_entidad", "direccion", "telefono", "ciudad"] },
        { model: CategoriaDonacion, attributes: ["id_categoria", "nombre"] }
      ],
      order: [["id_donacion", "DESC"]],
    });

    // Mapear la respuesta para que coincida con el Figma
    const resultado = donaciones.map(d => ({
      id_donacion: d.id_donacion,
      nombre: d.nombre,
      descripcion: d.descripcion,
      cantidad: d.cantidad,
      fecha_vencimiento: d.fecha_vencimiento,
      ubicacion: d.ubicacion,
      estado: d.estado,
      id_categoria: d.id_categoria,
      id_donador: d.id_donador,
      donador: d.donador,
      categoria: d.categoria_donacion
    }));

    return res.json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    // Adaptar la respuesta al Figma
    const donacion = await Donacion.findByPk(id, {
      include: [
        { model: Donador, attributes: ["id_donador", "nombre", "tipo_entidad", "direccion", "telefono", "ciudad"] },
        { model: CategoriaDonacion, attributes: ["id_categoria", "nombre"] },
        { model: Postulacion }
      ]
    });
    if (!donacion) return res.status(404).json({ error: "Donación no encontrada" });
    return res.json({
      id_donacion: donacion.id_donacion,
      nombre: donacion.nombre,
      descripcion: donacion.descripcion,
      cantidad: donacion.cantidad,
      fecha_vencimiento: donacion.fecha_vencimiento,
      ubicacion: donacion.ubicacion,
      estado: donacion.estado,
      id_categoria: donacion.id_categoria,
      id_donador: donacion.id_donador,
      donador: donacion.donador,
      categoria: donacion.categoria_donacion,
      postulaciones: donacion.postulacions
    });
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
