// src/routes/postulacionRoutes.js
import express from "express";
import { crearPostulacion, listarPostulacionesPorBeneficiario, listarPostulacionesPorDonacion, actualizarEstadoPostulacion } from "../controllers/postulacionController.js";
import { verificarToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, requireRole("beneficiario"), crearPostulacion);
router.get("/mis-postulaciones", verificarToken, requireRole("beneficiario"), listarPostulacionesPorBeneficiario);

router.get("/donacion/:id", verificarToken, requireRole("donador"), listarPostulacionesPorDonacion);
router.put("/:id/estado", verificarToken, requireRole("donador"), actualizarEstadoPostulacion);

export default router;
