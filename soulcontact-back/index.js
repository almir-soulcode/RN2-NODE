import express from "express";
import { config } from "dotenv";
config();
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongo DB Conectado!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
