// src/models/Usuario.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Usuario = sequelize.define(
  "usuario",
  {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    rol: { type: DataTypes.ENUM("donador", "beneficiario"), allowNull: false },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
