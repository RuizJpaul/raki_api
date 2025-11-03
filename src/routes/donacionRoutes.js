// src/routes/donacionRoutes.js
import express from "express";
import { crearDonacion, listarDonaciones, obtenerDonacion, editarDonacion, eliminarDonacion } from "../controllers/donacionController.js";
import { verificarToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listarDonaciones);
router.get("/:id", obtenerDonacion);

router.post("/", verificarToken, requireRole("donador"), crearDonacion);
router.put("/:id", verificarToken, requireRole("donador"), editarDonacion);
router.delete("/:id", verificarToken, requireRole("donador"), eliminarDonacion);

export default router;
