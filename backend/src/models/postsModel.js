import { DataTypes } from "sequelize";
import conn from "../config/conn.js";

const Post = conn.define("posts", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
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
  imagem: {
    type: DataTypes.STRING,
    defaultValue: null,
  }
}, {
  tableName: "posts", 
});

export default Post;
