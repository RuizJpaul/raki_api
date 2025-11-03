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
    const recientes = await Donacion.findAll({
      where: { id_donador: donador.id_donador },
      order: [["id_donacion", "DESC"]],
      limit: 5,
    });

    // categorías más donadas por este donador
    const categorias = await sequelize.query(
      `SELECT c.nombre, COUNT(*) as total FROM donaciones d
       JOIN "CategoriaDonacions" c ON c.id_categoria = d.id_categoria
       WHERE d.id_donador = :id
       GROUP BY c.nombre
       ORDER BY total DESC LIMIT 5`,
      { replacements: { id: donador.id_donador }, type: QueryTypes.SELECT }
    );

    res.json({ totalDonaciones, recientes, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const dashboardBeneficiario = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const beneficiario = await Beneficiario.findOne({ where: { id_usuario } });
    if (!beneficiario) return res.status(403).json({ mensaje: "No autorizado" });

    const postulaciones = await Postulacion.findAll({
      where: { id_beneficiario: beneficiario.id_beneficiario },
      order: [["fecha_postulacion", "DESC"]],
      limit: 10,
    });

    res.json({ postulaciones, capacidad: beneficiario.capacidad, contacto: beneficiario.persona_contacto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
