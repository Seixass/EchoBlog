import Post from "../models/postsModel.js";
import { Usuario } from "../models/usuariosModel.js"; // Importa o modelo de usuário
import { z } from "zod";

// Validações Zod
const idSchema = z.object({
  id: z.string().uuid("ID inválido. Deve ser um UUID válido."),
});
const createPostSchema = z.object({
  titulo: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  conteudo: z.string().min(5, { message: "O conteúdo deve ter pelo menos 5 caracteres" }),
  usuarioId: z.string().min(1, { message: "O ID do usuário é obrigatório" }),
  imagem: z.string().optional(),
});
const updateSchema = z.object({
  titulo: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }).optional(),
  conteudo: z.string().min(5, { message: "O conteúdo deve ter pelo menos 5 caracteres" }).optional(),
  imagem: z.string().url({ message: "A URL da imagem deve ser válida" }).optional(),
});

export const criarPostagem = async (req, res) => {
  try {
    const { titulo, conteudo, usuarioId, imagem } = createPostSchema.parse(req.body);

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const novaPostagem = await Post.create({
      titulo,
      conteudo,
      usuarioId,
      dataPublicacao: new Date(),
      imagem,
    });

    res.status(201).json({ msg: "Postagem criada com sucesso", postagem: novaPostagem });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Erro ao criar postagem", error: error.message });
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

export const atualizarPostagem = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);
    const { titulo, conteudo, imagem } = updateSchema.parse(req.body);

    const postagem = await Post.findByPk(id);

    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }

    postagem.titulo = titulo || postagem.titulo;
    postagem.conteudo = conteudo || postagem.conteudo;
    postagem.imagem = imagem || postagem.imagem;

    await postagem.save();

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
    res.status(500).json({ error: "Erro ao atualizar a postagem" });
  }
};

export const excluirPostagem = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);

    const postagem = await Post.findByPk(id);

    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }

    await postagem.destroy();

    res.status(200).json({ message: "Postagem excluída com sucesso" });
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
    res.status(500).json({ error: "Erro ao excluir a postagem" });
  }
};

export const uploadImagemPostagem = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);

    if (!req.file) {
      return res.status(400).json({ error: "Imagem não enviada" });
    }

    const postagem = await Post.findByPk(id);

    if (!postagem) {
      return res.status(404).json({ error: "Postagem não encontrada" });
    }

    postagem.imagem = `/uploads/images/${req.file.filename}`;
    await postagem.save();

    res.status(200).json({ message: "Imagem enviada com sucesso", imagem: postagem.imagem });
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
    res.status(500).json({ error: "Erro ao enviar a imagem" });
  }
};

export const listarPostagensPorAutor = async (req, res) => {
  try {
    const { autor } = req.query;

    const filtro = {};
    if (autor) {
      filtro.usuarioId = autor;
    }

    const postagens = await Post.findAll({ where: filtro });

    res.status(200).json(postagens);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao listar postagens", error: error.message });
  }
};
