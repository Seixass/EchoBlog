import { Router } from "express";
import { create, listarPostagens, buscarPostagemPorId, atualizarPostagem } from "../controllers/postsController.js";

const router = Router();


router.post("/", create);
router.get("/", listarPostagens);
router.get("/:id", buscarPostagemPorId);
router.put("/:id", atualizarPostagem);

export default router;