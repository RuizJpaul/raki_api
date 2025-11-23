// src/models/Beneficiario.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Beneficiario = sequelize.define(
  "beneficiario",
  {
    id_beneficiario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING },
    tipo_entidad: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
    capacidad_atencion: { type: DataTypes.INTEGER },
    persona_contacto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    ciudad: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
