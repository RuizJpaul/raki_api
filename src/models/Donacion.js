// src/models/Donacion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Donacion = sequelize.define(
  "donacion",
  {
    id_donacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_donador: { type: DataTypes.INTEGER },
    id_categoria: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    cantidad: { type: DataTypes.INTEGER },
    fecha_vencimiento: { type: DataTypes.DATE },
    ubicacion: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM("disponible", "entregada", "cancelada"), defaultValue: "disponible" },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
