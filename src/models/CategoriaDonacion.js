// src/models/CategoriaDonacion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const CategoriaDonacion = sequelize.define(
  "categoria_donacion",
  {
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
