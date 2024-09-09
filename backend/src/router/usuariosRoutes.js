import { Router } from "express";
import { registrarUsuario, loginUsuario, atualizarPerfilUsuario, listarUsuarios, excluirUsuario } from "../controllers/usuarioscontroller.js";
import { verificarAdmin, verificarToken } from "../Middlewares/authAdmin .js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", atualizarPerfilUsuario);
router.get("/", verificarToken, verificarAdmin, listarUsuarios);
router.delete("/:id", verificarToken, verificarAdmin, excluirUsuario);


export default router;