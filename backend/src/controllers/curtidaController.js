import Curtida from "../models/curtidasModel.js";
import { z } from "zod";

// Validação Zod
const idSchema = z.object({
  postagemId: z.string().uuid("ID de postagem inválido."),
});

// Adiciona ou remove uma curtida em uma postagem
export const curtirPostagem = async (req, res) => {
  try {
    const { postagemId } = idSchema.parse(req.params);
    const usuarioId = req.usuario.id;

    // Verifica se o usuário já curtiu essa postagem
    const curtidaExistente = await Curtida.findOne({
      where: { postagemId, usuarioId },
    });

    if (curtidaExistente) {
      await curtidaExistente.destroy();
      return res.status(200).json({ msg: "Curtida removida com sucesso" });
    }

    const novaCurtida = await Curtida.create({
      postagemId,
      usuarioId,
    });

    res.status(201).json({ msg: "Curtida adicionada com sucesso", curtida: novaCurtida });
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
    res.status(500).json({ error: "Erro ao curtir a postagem" });
  }
};
