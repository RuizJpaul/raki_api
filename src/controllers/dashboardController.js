// src/controllers/dashboardController.js
import { Donacion, CategoriaDonacion, Postulacion, Donador, Beneficiario } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

export const dashboardDonador = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const donador = await Donador.findOne({ where: { id_usuario } });
    if (!donador) return res.status(403).json({ mensaje: "No autorizado" });

    const totalDonaciones = await Donacion.count({ where: { id_donador: donador.id_donador } });
    const recientes = await Donacion.findAll({ where: { id_donador: donador.id_donador }, order: [["id_donacion","DESC"]], limit: 5 });

    const categorias = await sequelize.query(
      `SELECT c.nombre, COUNT(*) as total FROM donacion d
       JOIN categoria_donacion c ON c.id_categoria = d.id_categoria
       WHERE d.id_donador = :id
       GROUP BY c.nombre
       ORDER BY total DESC LIMIT 5`,
      { replacements: { id: donador.id_donador }, type: QueryTypes.SELECT }
    );

    // Respuesta adaptada al Figma
    return res.json({
      totalDonaciones,
      recientes: recientes.map(d => ({
        id_donacion: d.id_donacion,
        nombre: d.nombre,
        descripcion: d.descripcion,
        cantidad: d.cantidad,
        fecha_vencimiento: d.fecha_vencimiento,
        ubicacion: d.ubicacion,
        estado: d.estado,
        id_categoria: d.id_categoria,
        id_donador: d.id_donador
      })),
      categorias
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const dashboardBeneficiario = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const beneficiario = await Beneficiario.findOne({ where: { id_usuario } });
    if (!beneficiario) return res.status(403).json({ mensaje: "No autorizado" });

    const postulaciones = await Postulacion.findAll({ where: { id_beneficiario: beneficiario.id_beneficiario }, order: [["fecha_postulacion","DESC"]], limit: 10 });

    // Respuesta adaptada al Figma
    return res.json({
      postulaciones: postulaciones.map(p => ({
        id_postulacion: p.id_postulacion,
        id_donacion: p.id_donacion,
        id_beneficiario: p.id_beneficiario,
        fecha_postulacion: p.fecha_postulacion,
        estado: p.estado
      })),
      capacidad_atencion: beneficiario.capacidad_atencion,
      persona_contacto: beneficiario.persona_contacto
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};