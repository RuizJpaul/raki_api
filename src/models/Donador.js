// src/models/Donador.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Donador = sequelize.define(
  "donador",
  {
    id_donador: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING },
    tipo_entidad: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
    ruc: { type: DataTypes.STRING },
    persona_contacto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    // ciudad eliminado para alineación con Figma
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
