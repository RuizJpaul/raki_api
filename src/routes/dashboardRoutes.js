// src/routes/dashboardRoutes.js
import express from "express";
import { dashboardDonador, dashboardBeneficiario } from "../controllers/dashboardController.js";
import { verificarToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/donador", verificarToken, requireRole("donador"), dashboardDonador);
router.get("/beneficiario", verificarToken, requireRole("beneficiario"), dashboardBeneficiario);

export default router;
