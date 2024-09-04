import { Router } from "express";
import { create } from "../controllers/postsController.js";

const router = Router();


router.post("/", create);

export default router;