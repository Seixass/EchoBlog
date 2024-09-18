import { DataTypes } from "sequelize";
import conn from "../config/conn.js";
import Post from "./postsModel.js";
import { Usuario } from "./usuariosModel.js";

const Comentario = conn.define("comentarios", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.UUID,
    references: {
      model: "usuarios",
      key: "id",
    },
  },
  postagemId: {
    type: DataTypes.UUID,
    references: {
      model: "posts",
      key: "id",
    },
  },
}, {
  tableName: "comentarios",
});

export default Comentario;