import { Usuario } from "../usuariosModel.js";
import Post  from "../postsModel.js";

Usuario.hasMany(Post, { foreignKey: 'usuarioId', as: 'posts' });
Post.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuarios' });
