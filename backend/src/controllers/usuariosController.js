import { Usuario } from "../models/usuariosModel.js";
import bcrypt from "bcrypt";
import { z } from "zod";

//validação zod
const createUserSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  papel: z.enum(["administrador", "autor", "leitor"]).optional(),
});

export const registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, papel } = createUserSchema.parse(req.body);
    const hashedSenha = await bcrypt.hash(senha, 10);

const definirPapel = papel ? papel : "leitor"

const novoUsuario = await Usuario.create({
    nome,
    email,
    senha: hashedSenha,
    papel: definirPapel,
});

    res.status(201).json({ msg: "Usuário registrado com sucesso", usuario: novoUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
