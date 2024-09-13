import { Router } from "express";
import { registrarUsuario, loginUsuario, atualizarUsuario, listarUsuarios, excluirUsuario, atualizarPapelUsuario  } from "../controllers/usuarioscontroller.js";
import { verificarAdmin, verificarToken } from "../Middlewares/authAdmin .js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", verificarToken, atualizarUsuario);
router.delete("/delete-user/:id", verificarAdmin, excluirUsuario);
router.get("/adm", verificarAdmin, listarUsuarios);
router.put("/atualizar-papel/:id", atualizarPapelUsuario); 

export default router;