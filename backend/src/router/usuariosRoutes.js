import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  atualizarUsuario,
  listarUsuarios,
  excluirUsuario,
  atualizarPapelUsuario,
} from "../controllers/usuarioscontroller.js";
import { verificarToken } from "../Middlewares/verificarToken.js";
import verificarPapelAdmin from "../Middlewares/authAdmin.js"

const router = Router();

router.get("/adm", verificarPapelAdmin, listarUsuarios, verificarToken);
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", verificarToken, atualizarUsuario);
router.delete("/delete-user/:id", verificarPapelAdmin, excluirUsuario);
router.put("/atualizar-papel/:id", atualizarPapelUsuario);

export default router;
