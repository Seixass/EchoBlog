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
  //implementando a validação com zod
  const bodyValidation = createSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({
      msg: "Os dados recebidos do corpo da requisição são inválidos",
      detalhes: formatZodError(bodyValidation.error),
    });
  }

  const { titulo, conteudo, autor } = req.body;

  const novoPost = {
    titulo,
    conteudo,
    autor,
  };

  try {
    await Post.create(novoPost);
    res.status(201).json({ msg: "Post Enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao enviar o post" });
  }
};
