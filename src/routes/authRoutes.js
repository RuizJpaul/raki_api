// src/routes/authRoutes.js
import express from "express";
import { registrar, login, perfil } from "../controllers/authController.js";

const router = express.Router();


import { verificarToken } from "../middleware/authMiddleware.js";

router.get("/profile", verificarToken, perfil);

export default router;
