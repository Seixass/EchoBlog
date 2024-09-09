import { Router } from "express";
import { registrarUsuario } from "../controllers/usuarioscontroller.js";

const router = Router();

router.post("/registro", registrarUsuario);

export default router;