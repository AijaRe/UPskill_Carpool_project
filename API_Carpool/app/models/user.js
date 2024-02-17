const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with the SQLite configuration
// log only error messages (default logs db detils on startup)
const sequelize = new Sequelize(process.env.POSTGRE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const UserModel = {
  // id is autoincremented number by SQL default
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validation for email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: "cliente", // Default value is 'cliente
    validate: {
      isIn: [["admin", "cliente"]],
    },
  },
  telefone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5,
    validate: {
      min: 0,
      max: 5,
    },
  },
  nAvaliacoes: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      isInt: true,
    },
  },
  eAtivo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    validate: {
      isBoolean(value) {
        if (typeof value !== "boolean") {
          throw new Error("eAtivo deve ser um valor booleano");
        }
      },
    },
  },
};

const User = sequelize.define("User", UserModel);

// Synchronize the defined models with the database
sequelize
  .sync()
  .then(() => {
    console.log("SQL Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

module.exports = User;
