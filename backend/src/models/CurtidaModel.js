import { DataTypes } from "sequelize";
import conn from "../config/conn.js";
import Post from "./postsModel.js";
import { Usuario } from "./usuariosModel.js";

const Curtida = conn.define("curtidas", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  tableName: "curtidas",
});

export default Curtida;