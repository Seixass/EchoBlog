import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Acesso negado, token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token inválido" });
  }
};

export const verificarAdmin = (req, res, next) => {
  const { papel } = req.usuario;

  if (papel !== "administrador") {
    return res.status(403).json({ msg: "Acesso negado, apenas administradores podem acessar este recurso" });
  }

  next();
};