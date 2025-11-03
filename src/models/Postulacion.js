// src/models/Postulacion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Postulacion = sequelize.define(
  "postulacion",
  {
    id_postulacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_donacion: { type: DataTypes.INTEGER },
    id_beneficiario: { type: DataTypes.INTEGER },
    fecha_postulacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM("pendiente", "aprobada", "rechazada"), defaultValue: "pendiente" },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
