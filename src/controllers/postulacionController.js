// src/controllers/postulacionController.js
import { Postulacion, Donacion, Beneficiario, Donador } from "../models/index.js";

export const crearPostulacion = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const beneficiario = await Beneficiario.findOne({ where: { id_usuario } });
    if (!beneficiario) return res.status(403).json({ mensaje: "Solo beneficiarios pueden postular" });

    const { id_donacion } = req.body;
    const donacion = await Donacion.findByPk(id_donacion);
    if (!donacion) return res.status(404).json({ mensaje: "Donación no encontrada" });
    if (donacion.estado !== "disponible") return res.status(400).json({ mensaje: "Donación no disponible" });

    const existe = await Postulacion.findOne({ where: { id_donacion, id_beneficiario: beneficiario.id_beneficiario } });
    if (existe) return res.status(400).json({ mensaje: "Ya te postulaste a esta donación" });

    const postulacion = await Postulacion.create({ id_donacion, id_beneficiario: beneficiario.id_beneficiario, estado: "pendiente" });
    return res.status(201).json(postulacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const listarPostulacionesPorBeneficiario = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const beneficiario = await Beneficiario.findOne({ where: { id_usuario } });
    if (!beneficiario) return res.status(403).json({ mensaje: "No autorizado" });

    const postulaciones = await Postulacion.findAll({ where: { id_beneficiario: beneficiario.id_beneficiario }, include: [{ model: Donacion }], order: [["fecha_postulacion", "DESC"]] });
    return res.json(postulaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const listarPostulacionesPorDonacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;
    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador) return res.status(403).json({ mensaje: "No autorizado" });

    const donacion = await Donacion.findByPk(id);
    if (!donacion || donacion.id_donador !== donador.id_donador) return res.status(404).json({ mensaje: "Donación no encontrada o no es tuya" });

    const postulaciones = await Postulacion.findAll({ where: { id_donacion: id }, order: [["fecha_postulacion", "DESC"]] });
    return res.json(postulaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const actualizarEstadoPostulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const { id_usuario } = req.usuario;

    const postulacion = await Postulacion.findByPk(id);
    if (!postulacion) return res.status(404).json({ mensaje: "Postulación no encontrada" });

    const donacion = await Donacion.findByPk(postulacion.id_donacion);
    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador || donacion.id_donador !== donador.id_donador) return res.status(403).json({ mensaje: "No autorizado" });

    if (!["aprobada", "rechazada"].includes(estado)) return res.status(400).json({ mensaje: "Estado inválido" });

    await postulacion.update({ estado });

    if (estado === "aprobada") {
      await donacion.update({ estado: "entregada" });
    }

    return res.json({ mensaje: "Estado actualizado", postulacion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
