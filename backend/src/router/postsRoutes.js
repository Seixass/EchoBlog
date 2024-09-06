import { Router } from "express";
import { create, listarPostagens } from "../controllers/postsController.js";

const router = Router();


router.post("/", create);
router.get("/", listarPostagens);

export default router;