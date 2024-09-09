import { Router } from "express";
import { registrarUsuario, loginUsuario, atualizarPerfilUsuario } from "../controllers/usuarioscontroller.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", atualizarPerfilUsuario);




export default router;