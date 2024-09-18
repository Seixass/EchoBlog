import Comentario from "../models/comentariosModel.js";
import { z } from "zod";

// Validações Zod
const comentarioSchema = z.object({
  conteudo: z.string().min(1, { message: "O conteúdo do comentário é obrigatório" }),
  postagemId: z.string().uuid("ID de postagem inválido."),
});
const idSchema = z.object({
  id: z.string().uuid("ID inválido. Deve ser um UUID válido."),
});

// Adiciona um comentário a uma postagem
export const adicionarComentario = async (req, res) => {
  try {
    const { conteudo, postagemId } = comentarioSchema.parse(req.body);
    const usuarioId = req.usuario.id;

    const novoComentario = await Comentario.create({
      conteudo,
      usuarioId,
      postagemId,
    });

    res.status(201).json({ msg: "Comentário adicionado com sucesso", comentario: novoComentario });
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
    res.status(500).json({ error: "Erro ao adicionar comentário" });
  }
};

// Edita um comentário
export const editarComentario = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);
    const { conteudo } = comentarioSchema.pick({ conteudo: true }).parse(req.body);

    const comentario = await Comentario.findByPk(id);

    if (!comentario || comentario.usuarioId !== req.usuario.id) {
      return res.status(404).json({ error: "Comentário não encontrado ou sem permissão" });
    }

    comentario.conteudo = conteudo;
    await comentario.save();

    res.status(200).json({ msg: "Comentário atualizado", comentario });
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
    res.status(500).json({ error: "Erro ao editar comentário" });
  }
};

// Exclui um comentário
export const excluirComentario = async (req, res) => {
  try {
    const { id } = idSchema.parse(req.params);

    const comentario = await Comentario.findByPk(id);

    if (!comentario || comentario.usuarioId !== req.usuario.id) {
      return res.status(404).json({ error: "Comentário não encontrado ou sem permissão" });
    }

    await comentario.destroy();

    res.status(200).json({ msg: "Comentário excluído" });
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
    res.status(500).json({ error: "Erro ao excluir comentário" });
  }
};

// Lista os comentários de uma postagem
export const listarComentariosPorPostagem = async (req, res) => {
  try {
    const { postagemId } = idSchema.parse(req.params);

    const comentarios = await Comentario.findAll({ where: { postagemId } });

    res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar comentários" });
  }
};
