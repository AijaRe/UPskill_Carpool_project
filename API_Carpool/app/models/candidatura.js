const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidaturaSchema = new Schema(
  {
    ofertaBoleia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfertaBoleia",
      required: true,
    },
    passageiro: {
      type: Number,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendente", "aprovada", "rejeitada"],
      default: "pendente",
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

module.exports = mongoose.model("Candidatura", candidaturaSchema);
