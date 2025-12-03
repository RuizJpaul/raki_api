// src/routes/donacionRoutes.js
import express from "express";
import { crearDonacion, listarDonaciones, obtenerDonacion, editarDonacion, eliminarDonacion, obtenerMisDonaciones } from "../controllers/donacionController.js";
import { verificarToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listarDonaciones);

// 1. RUTA ESPECÍFICA: Debe ir PRIMERO para evitar colisión con el parámetro :id.
router.get("/mis-donaciones", verificarToken, obtenerMisDonaciones); 

// 2. RUTA DINÁMICA: Ahora, solo se ejecutará si el parámetro es un ID numérico o cualquier otra cosa que no sea 'mis-donaciones'.
router.get("/:id", obtenerDonacion); 

router.post("/", verificarToken, requireRole("donador"), crearDonacion);
router.put("/:id", verificarToken, requireRole("donador"), editarDonacion);
router.delete("/:id", verificarToken, requireRole("donador"), eliminarDonacion);

export default router;