import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/cliente.js";
import { Endereco } from "./models/endereco.js";
import { Pet } from "./models/pet.js";

authenticate(connection).then(() => {
  // Após conectar no banco de dados, ele irá sincronizar os models
  // no banco, ou seja, irá gerar as tabelas caso necessário
  // force: true -> irá dropar tudo e criar do zero novamente
  // recomendado apenas durante o desenvolvimento
  //   connection.sync({ force: true });
  connection.sync();
});
