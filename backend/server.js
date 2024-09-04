import "dotenv/config";
import express from "express";
import cors from "cors";
import conn from "./src/config/conn.js";

//importação dos models
import postsModel from "./src/models/postsModel.js";
import postsRouter from "./src/router/postsRoutes.js";

//importação das rotas

const PORT = process.env.PORT || 9090;

const app = express();

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//conexão com o banco
conn
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

//utilizar rotas
app.use("/postagens", postsRouter)

app.use((req, res) => {
  res.status(404).json({ msg: "Rota não encontrada" });
});
