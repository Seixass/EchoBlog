import { Router } from "express";
import { create, listarPostagens, buscarPostagemPorId, atualizarPostagem, excluirPostagem, uploadImagemPostagem } from "../controllers/postsController.js";
import upload from "../Middlewares/uploadMiddleware.js";

const router = Router();


router.post("/", create);
router.get("/", listarPostagens);
router.get("/:id", buscarPostagemPorId);
router.put("/:id", atualizarPostagem);
router.delete("/:id", excluirPostagem);
router.post("/:id/imagem", upload.single("imagem"), uploadImagemPostagem);

export default router;