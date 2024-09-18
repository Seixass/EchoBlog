import Usuario from "../usuariosModel.js";
import Post  from "../postsModel.js";
import Comentario from "../comentariosModel.js";
import Curtida from "../CurtidaModel.js";

//Associações usuarios e posts
Usuario.hasMany(Post, { foreignKey: 'usuarioId', as: 'posts' });
Post.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'autor' });

//Associações das comentarios
Comentario.belongsTo(Post, { foreignKey: 'postagemId', as: 'postagem' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'autor' });

//Associações das curtidas
Curtida.belongsTo(Post, { foreignKey: 'postagemId', as: 'postagem' });
Curtida.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'autor' });