import express from "express";
import { 
  criarPostagem,
  listarPostagens,
  buscarPostagemPorId,
  atualizarPostagem,
  excluirPostagem,
  uploadImagemPostagem,
  listarPostagensPorAutor 
} from "../controllers/postsController.js";
import upload from "../Middlewares/uploadMiddleware.js";
import { verificarToken } from "../Middlewares/verificarToken.js";

const router = express.Router();

router.post("/registro", criarPostagem);
router.get("/", listarPostagens);
router.get("/:id", buscarPostagemPorId);
router.put("/:id", verificarToken, atualizarPostagem);
router.delete("/:id", verificarToken, excluirPostagem);
router.post("/:id/imagem", verificarToken, upload.single("imagem"), uploadImagemPostagem);
router.get("/autor", verificarToken, listarPostagensPorAutor);

export default router;
