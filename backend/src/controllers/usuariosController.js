import { Usuario } from "../models/usuariosModel.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Validações Zod
const createUserSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  papel: z.enum(["administrador", "autor", "leitor"]).optional(),
});
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});
const updateUserSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }).optional(),
});
const papelSchema = z.object({
  papel: z.enum(["administrador", "autor", "leitor"], { message: "Papel inválido" }),
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

    res.status(201).json({ msg: "Usuário registrado com sucesso", usuario: novoUsuario });
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

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ msg: "Senha incorreta" });
    }

    const token = jwt.sign({ id: usuario.id, papel: usuario.papel }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ msg: "Login bem-sucedido", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = updateUserSchema.parse(req.body);

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;

    if (senha) {
      usuario.senha = await bcrypt.hash(senha, 10);
    }

    await usuario.save();

    res.status(200).json({ msg: "Usuário atualizado com sucesso", usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    await usuario.destroy();

    res.status(200).json({ msg: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário", details: error.message });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao listar usuários", error: error.message });
  }
};

export const atualizarPapelUsuario = async (req, res) => {
  try {
    const { id } = req.params; 
    const { papel } = papelSchema.parse(req.body); 

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    usuario.papel = papel;
    await usuario.save();

    res.status(200).json({ msg: "Papel do usuário atualizado com sucesso", usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
