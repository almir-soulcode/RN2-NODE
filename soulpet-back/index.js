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

// Garantir que todas as requisições que têm body sejam lidas como JSON
app.use(express.json());

// Definir os endpoints do backend
// Métodos: GET (leitura), POST (inserção), PUT (alteração), DELETE (remoção)
app.get("/hello", (req, res) => {
  // manipulador de rota
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
    include: [Endereco], // juntar os dados do cliente com seu respectivo endereço
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encontrado!" });
  }
});

app.post("/clientes", async (req, res) => {
  // Extraimos os dados do body que serão usados na inserção
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Tentativa de inserir o cliente
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] } // indicamos que o endereço será salvo e associado ao cliente
    );
    res.json({ message: "Cliente criado com sucesso." });
  } catch (err) {
    // 500 -> Internal Error
    console.log(err);
    res.status(500).json({ message: "Um erro ocorreu ao inserir cliente." });
  }
});

app.put("/clientes/:id", async (req, res) => {
  const idCliente = req.params.id;
  const { nome, email, telefone, endereco } = req.body;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });

    if (cliente) {
      // Atualiza a linha do endereço que for o id do cliente
      // for igual ao id do cliente sendo atualizado.
      await Endereco.update(endereco, { where: { clienteId: idCliente } });
      await cliente.update({ nome, email, telefone });
      res.json({ message: "Cliente atualizado." });
    } else {
      res.status(404).json({ message: "O cliente não encontrado." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao atualizar o cliente." });
  }
});

app.delete("/clientes/:id", async (req, res) => {
  const idCliente = req.params.id;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });

    if (cliente) {
      await cliente.destroy();
      res.json({ message: "Cliente removido com sucesso." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Um erro ocorreu ao excluir cliente" });
  }
});

// [GET] /pets -> listar todos os pets
app.get("/pets", async (req, res) => {
  const listaPets = await Pet.findAll();
  res.json(listaPets);
});

// [GET] /pets/:id -> listar um pet específico (detalhe)
app.get("/pets/:id", async (req, res) => {
  const pet = await Pet.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: Cliente, attributes: ["id", ["nome", "nomeCliente"]] }],
  });

  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: "Pet não encontrado." });
  }
});

// [DELETE] /pets/:id -> deletar um pet específico
app.delete("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (pet) {
      await pet.destroy();
      res.json({ message: "Pet removido com sucesso" });
    } else {
      res.status(404).json({ message: "Pet não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Ocorreu um erro ao excluir pet" });
  }
});

// [POST] /pets -> Inserir um novo pet
app.post("/pets", async (req, res) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);

    if (cliente) {
      await Pet.create({ nome, tipo, porte, dataNasc, clienteId });
      res.json({ message: "Pet criado com sucesso." });
    } else {
      res
        .status(404)
        .json({ message: "Falha ao inserir pet. Cliente não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Ocorreu um erro ao adicionar pet." });
  }
});

// [PUT] /pets/:id -> Atualizar um pet
app.put("/pets/:id", async (req, res) => {
  const { nome, tipo, porte, dataNasc } = req.body;

  try {
    const pet = await Pet.findByPk(req.params.id);
    if (pet) {
      await pet.update({ nome, tipo, porte, dataNasc });
      res.json({message: "Pet atualizado com sucesso."});
    } else {
      res.status(404).json({ message: "Pet não encontrado." });
    }
  } catch (err) {
    res.status(500).json({message: "Um erro ocorreu ao atualizar pet."});
  }
});

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
