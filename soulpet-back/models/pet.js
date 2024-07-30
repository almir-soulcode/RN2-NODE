// Colunas: nome (string), tipo (string), porte (string), dataNasc (dateonly)
import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Pet = connection.define("pet", {
  nome: {
    type: DataTypes.STRING(90),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  porte: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
  },
});
