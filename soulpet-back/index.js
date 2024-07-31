import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/cliente.js";
import { Endereco } from "./models/endereco.js";
import { Pet } from "./models/pet.js";
import express from "express";

authenticate(connection).then(() => {
  // Após conectar no banco de dados, ele irá sincronizar os models
  // no banco, ou seja, irá gerar as tabelas caso necessário
  // force: true -> irá dropar tudo e criar do zero novamente
  // recomendado apenas durante o desenvolvimento
  //   connection.sync({ force: true });
  connection.sync();
});

// Definir a aplicação backend em Express
// Recursos pré-configurados
const app = express();

// Definir os endpoints do backend
// Métodos: GET (leitura), POST (inserção), PUT (alteração), DELETE (remoção)
app.get("/hello", (req, res) => { // manipulador de rota
  res.send("Batata!"); // enviando a resposta para quem solicitou
});

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});