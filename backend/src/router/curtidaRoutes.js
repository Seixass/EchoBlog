import { Router } from "express";
import { curtirPostagem } from "../controllers/curtidasController.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router();

router.post("/:postagemId/curtidas", verificarToken, curtirPostagem);

export default router;
