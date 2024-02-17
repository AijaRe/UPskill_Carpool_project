const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var LocalSchema = new Schema({
  municipios: {
    type: String,
    required: true,
  },
  freguesias: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Local", LocalSchema);
