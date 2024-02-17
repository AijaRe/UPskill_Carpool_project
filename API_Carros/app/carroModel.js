const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CarroSchema = new Schema({
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("Carro", CarroSchema);
