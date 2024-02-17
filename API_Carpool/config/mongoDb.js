const mongoose = require("mongoose");

const connectDatabase = async () => {
  const dbServer = process.env.DB_SERVER;
  const dbName = process.env.DB_NAME;

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(`mongodb+srv://${dbServer}/${dbName}`);

    console.log("MongoDB connection successful");
  } catch (err) {
    console.error("MongoDB connection error", err);
    throw err;
  }
};

module.exports = {
  mongoose,
  connectDatabase,
};
