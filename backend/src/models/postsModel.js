import conn from "../config/conn.js";
import { DataTypes } from "sequelize";

const Post = conn.define(
  "posts",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    conteudo: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    dataPublicacao: {
      type: DataTypes.DATE,
      allowNull: false,
      required: true,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    imagem: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "posts",
  }
);
  
export default Post;