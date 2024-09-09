import { Usuario } from "../models/usuariosModel.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

//validação zod
const createUserSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  papel: z.enum(["administrador", "autor", "leitor"]).optional(),
});
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});
const updateUserSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).optional(),
    email: z.string().email({ message: "Email inválido" }).optional(),
    senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }).optional(),
  });

export const registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, papel } = createUserSchema.parse(req.body);
    const hashedSenha = await bcrypt.hash(senha, 10);

    const definirPapel = papel ? papel : "leitor";

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: hashedSenha,
      papel: definirPapel,
    });

    res
      .status(201)
      .json({ msg: "Usuário registrado com sucesso", usuario: novoUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ msg: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ msg: "Login realizado com sucesso", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const atualizarPerfilUsuario = async (req, res) => {
    try {
      const { nome, email, senha } = updateUserSchema.parse(req.body);
  
      const { id } = req.params;
  
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
  
      if (nome) usuario.nome = nome;
      if (email) {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
          return res.status(400).json({ msg: "O email já está em uso" });
        }
        usuario.email = email;
      }
  
      if (senha) {
        const hashedSenha = await bcrypt.hash(senha, 10);
        usuario.senha = hashedSenha;
      }
  
      await usuario.save();
  
      res.status(200).json({ msg: "Perfil atualizado com sucesso", usuario });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
