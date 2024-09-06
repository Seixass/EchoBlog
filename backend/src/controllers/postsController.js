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
    const { titulo, conteudo, autor } = createSchema.parse(req.body);


    const newPost = await Post.create({
      titulo,
      conteudo,
      dataPublicacao: new Date(),
      autor,
      imagem: req.body.imagem || null, 
    });

    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o post" });
  }
};


export const listarPostagens = async (req, res) => {
  try {
    const itemsPorPagina = parseInt(req.query.limit) || 10; 
    const paginaAtual = parseInt(req.query.page) || 1; 
    const offset = (paginaAtual - 1) * itemsPorPagina; 

    const { count: totalPostagens, rows: postagens } = await Post.findAndCountAll({
      limit: itemsPorPagina,
      offset: offset,
    });

    const totalPaginas = Math.ceil(totalPostagens / itemsPorPagina);

    const proximaPagina = paginaAtual < totalPaginas
      ? `${req.protocol}://${req.get('host')}${req.baseUrl}/postagens?page=${paginaAtual + 1}&limit=${itemsPorPagina}`
      : null;

    res.status(200).json({
      totalPostagens,
      totalPaginas,
      paginaAtual,
      itemsPorPagina,
      proximaPagina,
      postagens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar postagens" });
  }
};

export const buscarPostagemPorId = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);

    const postagem = await Post.findByPk(id);

    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }

    res.status(200).json(postagem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar a postagem" });
  }
};