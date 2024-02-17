const bcrypt = require("bcrypt");
const User = require("../models/user");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRepo = {
  getAllUsers: async () => {
    try {
      return await User.findAll();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  registerUser: async (data) => {
    try {
      const cryptPassword = await bcrypt.hash(data.password, 10);
      const newUser = await User.create({
        nome: data.nome,
        email: data.email,
        password: cryptPassword,
        telefone: data.telefone,
      });
      return newUser.toJSON();
    } catch (err) {
      if (
        err instanceof Sequelize.UniqueConstraintError &&
        err.errors[0].path === "email"
      ) {
        throw new Error("Email já registado");
      } else {
        throw err;
      }
    }
  },

  loginUser: async (email, password) => {
    try {
      // scope(null) remove a validação em user model que esconde a palavra pass em "findOne"
      const user = await User.scope(null).findOne({ where: { email } });
      if (!user || !user.eAtivo) return null;
      // compare the hashed input password
      // with the stored hashed password using bcrypt.compare()
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;
      const secretKey = process.env.SECRET_KEY;
      // generate JWT token if the password matches
      const token = jwt.sign(
        {
          email: user.email, //remove if not used
          id: user.id,
          tipo: user.tipo,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      return {
        nome: user.nome, //delete at the end
        userToken: `Bearer ${token}`,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getUserByToken: async (userID) => {
    try {
      const user = await User.findOne({
        where: { id: userID },
        attributes: ["id", "nome", "email", "telefone", "rating"],
      });
      if (!user) {
        throw new Error("User não encontrado");
      }
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getOneUser: async (userID) => {
    try {
      return await User.findOne({
        where: { id: userID },
        attributes: {
          exclude: ["password", "eAtivo", "updatedAt", "createdAt"],
        },
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getUserInfo: async (userId) => {
    try {
      const user = await User.findByPk(userId, {
        attributes: ["nome", "telefone", "rating", "nAvaliacoes"],
      });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  updateUserRating: async (userID, avaliacao) => {
    try {
      const user = await User.findByPk(userID);

      if (!user) {
        return null;
      }
      // Ensure numeric types
      const rating = parseFloat(user.rating);
      const nAvaliacoes = parseInt(user.nAvaliacoes);
      const parseAvaliacao = parseFloat(avaliacao);

      // Update user rating and increment nAvaliacoes
      user.rating = (rating * nAvaliacoes + parseAvaliacao) / (nAvaliacoes + 1);
      user.nAvaliacoes += 1;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error updating user rating: ${error.message}`);
    }
  },

  verifyUserPassword: async (id, currentPassword) => {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return false;
      }
      return await bcrypt.compare(currentPassword, user.password);
    } catch (err) {
      throw new Error(err.message);
    }
  },

  updateUserPasswordById: async (id, newPassword) => {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error("User não encontrado, para update password");
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (err) {
      throw new Error("Erro no update password: " + err.message);
    }
  },

  editUserByEmail: async (email, updatedFields) => {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return null;
      }

      // Atualizando apenas os campos fornecidos
      if (updatedFields.tipo) {
        user.tipo = updatedFields.tipo;
      }
      if (typeof updatedFields.eAtivo !== "undefined") {
        // Verifica se eAtivo foi fornecido
        user.eAtivo = updatedFields.eAtivo;
      }

      await user.save();
      return user; // Retorna o objeto user atualizado
    } catch (err) {
      throw new Error(err.message);
    }
  },

  forgetUser: async (userId) => {
    try {
      const [rowsAffected, [user]] = await User.update(
        { eAtivo: false },
        {
          returning: true,
          where: { id: userId },
        }
      );

      if (rowsAffected === 0 || !user) {
        throw new Error("User não encontrado, para forget user");
      }

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  deleteUser: async (userID) => {
    try {
      const user = await User.findByPk(userID);
      if (!user) {
        throw new Error("User não encontrado, para delete user");
      }
      await user.destroy();
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

module.exports = userRepo;
