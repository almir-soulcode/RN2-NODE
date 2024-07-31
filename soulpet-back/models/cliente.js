// Modelo para gerar a tabela de clientes no MySQL
// Mapeamento: cada propriedade que definimos vira uma coluna da tabela

import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";
import { Endereco } from "./endereco.js";
import { Pet } from "./pet.js";

// Obs: O Sequelize define implicitamente a chave primária
export const Cliente = connection.define("cliente", {
  // Configurando a coluna 'nome'
  nome: {
    // nome VARCHAR(130) NOT NULL
    type: DataTypes.STRING(130), // Defina a coluna 'nome' como VARCHAR
    allowNull: false, // Torna a coluna NOT NULL
  },
  email: {
    // email VARCHAR(255) UNIQUE NOT NULL
    type: DataTypes.STRING, // Por padrão 255
    allowNull: false,
    unique: true, // Define os dados da coluna como UNIQUE
  },
  telefone: {
    // telefone VARCHAR(255) UNIQUE NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Associação 1:1 (Cliente-Endereço)
// Cliente tem um Endereco
// Endereço ganha uma chave estrangeira

// CASCADE -> indica que se o cliente for deletado o endereço será deletado também.
Cliente.hasOne(Endereco, { onDelete: "CASCADE" });
Endereco.belongsTo(Cliente); // Gerar uma chave estrangeira na tabela enderecos

// Associação 1:N (Cliente-Pet)
Cliente.hasMany(Pet, { onDelete: "CASCADE" });
Pet.belongsTo(Cliente); // Gera uma chave estrangeira para indicar o responsável

// Cliente = model = gerenciar a tabela de clientes

// Cliente.findAll() -> Listar todos os clientes na tabela
// Cliente.update(novosDados) -> atualizar um cliente específico
// Cliente.destroy() -> apagar o cliente da tabela
// Cliente.findOne
