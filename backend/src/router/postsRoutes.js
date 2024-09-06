import { Router } from "express";
import { create, listarPostagens, buscarPostagemPorId } from "../controllers/postsController.js";

const router = Router();


router.post("/", create);
router.get("/", listarPostagens);
router.get("/:id", buscarPostagemPorId);

export default router;