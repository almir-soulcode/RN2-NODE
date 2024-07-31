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

// Listagem de todos os clientes
app.get("/clientes", async (req, res) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

// Listagem de um cliente específico (ID = ?)
// :id => parâmetro de rota
app.get("/clientes/:id", async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const cliente = await Cliente.findOne({ 
    where: { id: req.params.id },
    include: [Endereco] // juntar os dados do cliente com seu respectivo endereço
  });
  
  if(cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encontrado!" });
  }
});

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});