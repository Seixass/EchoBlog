import Post from "../models/postsModel.js";
import { z } from "zod";

const idSchema = z.object({
  id: z.string().uuid("ID inválido. Deve ser um UUID válido."),
});

const createSchema = z.object({
  titulo: z
    .string()
    .min(3, { msg: "O titulo deve ter pelo menos 3 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  conteudo: z
    .string()
    .min(5, { msg: "O conteudo deve ter pelo menos 5 caracteres" }),
  autor: z
    .string()
    .min(5, { msg: "O conteudo deve ter pelo menos 5 caracteres" }),
});

export const create = async (req, res) => {
  try {
    const { titulo, conteudo, autor, imagem } = req.body;
    const newPost = await Post.create({
      titulo,
      conteudo,
      dataPublicacao: new Date(),
      autor,
      imagem
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o post" });
  }
};
