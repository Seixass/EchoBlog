import { Router } from "express";
import { adicionarComentario, editarComentario, excluirComentario, listarComentariosPorPostagem } from "../controllers/comentariosController.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router();

router.post("/:postagemId/comentarios", verificarToken, adicionarComentario);
router.put("/comentarios/:id", verificarToken, editarComentario);
router.delete("/comentarios/:id", verificarToken, excluirComentario);
router.get("/:postagemId/comentarios", listarComentariosPorPostagem);

export default router;
