import { model, Schema } from "mongoose";

export const Contato = model("contato", new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    telefone: {
        type: String,
        unique: true,
        required: true
    },
    observacoes: {
        type: String
    },
    favorito: {
        type: Boolean,
        default: false
    }
}));
