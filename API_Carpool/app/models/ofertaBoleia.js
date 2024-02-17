const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ofertaBoleiaSchema = new Schema(
  {
    carro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carro",
      required: true,
    },
    matricula: {
      type: String,
      required: true,
    },
    cor: {
      type: String,
      required: true,
    },
    partidaMunicipio: {
      type: String,
      required: true,
    },
    partidaFreguesia: {
      type: String,
      required: true,
    },
    destinoMunicipio: {
      type: String,
      required: true,
    },
    destinoFreguesia: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    lugares: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: (props) =>
          `${props.value} não é um número inteiro válido para a quantidade de lugares.`,
      },
    },
    condutor: {
      type: Number, // ou String, dependendo do formato do seu ID
      required: true,
    },
    cancelada: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OfertaBoleia", ofertaBoleiaSchema);
