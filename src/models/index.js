// src/models/index.js
import { Usuario } from "./Usuario.js";
import { Donador } from "./Donador.js";
import { Beneficiario } from "./Beneficiario.js";
import { CategoriaDonacion } from "./CategoriaDonacion.js";
import { Donacion } from "./Donacion.js";
import { Postulacion } from "./Postulacion.js";

// Asociaciones (no crean/alteran tablas; solo para consultas)
Usuario.hasOne(Donador, { foreignKey: "id_usuario" });
Donador.belongsTo(Usuario, { foreignKey: "id_usuario" });

Usuario.hasOne(Beneficiario, { foreignKey: "id_usuario" });
Beneficiario.belongsTo(Usuario, { foreignKey: "id_usuario" });

Donador.hasMany(Donacion, { foreignKey: "id_donador" });
Donacion.belongsTo(Donador, { foreignKey: "id_donador" });

CategoriaDonacion.hasMany(Donacion, { foreignKey: "id_categoria" });
Donacion.belongsTo(CategoriaDonacion, { foreignKey: "id_categoria" });

Donacion.hasMany(Postulacion, { foreignKey: "id_donacion" });
Postulacion.belongsTo(Donacion, { foreignKey: "id_donacion" });

Beneficiario.hasMany(Postulacion, { foreignKey: "id_beneficiario" });
Postulacion.belongsTo(Beneficiario, { foreignKey: "id_beneficiario" });

export {
  Usuario,
  Donador,
  Beneficiario,
  CategoriaDonacion,
  Donacion,
  Postulacion,
};
