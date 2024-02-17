const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BoleiaSchema = new Schema({
  ofertaBoleia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OfertaBoleia",
    required: true,
  },

  data: {
    type: Date,
    required: true,
  },

  condutor: {
    type: Number,
    required: true,
  },

  passageiro: {
    type: Number,
    required: true,
  },

  avCondutor: {
    type: Number,
    validate: {
      validator: function (value) {
        return (
          value === null ||
          (Number.isInteger(value) && value >= 0 && value <= 5)
        );
      },
      message: "A avaliacao do condutor deve ser um numero inteiro de 0 a 5",
    },
    default: null,
  },

  avPassageiro: {
    type: Number,
    validate: {
      validator: function (value) {
        return (
          value === null ||
          (Number.isInteger(value) && value >= 0 && value <= 5)
        );
      },
      message: "A avaliacao do passageiro deve ser um numero inteiro de 0 a 5",
    },
    default: null,
  },

  terminado: {
    type: Boolean,
    default: false,
  },

  cancelado: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Boleia", BoleiaSchema);
