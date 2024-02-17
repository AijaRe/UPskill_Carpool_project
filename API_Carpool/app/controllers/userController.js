const { update } = require("../models/ofertaBoleia");
const userRepo = require("../repositories/userRepo");
const tokenBlacklist = require("../utils/tokenBlacklist");

// GET http://localhost:3000/api/user/
getAllUsers = async function (req, res) {
  try {
    const allUsers = await userRepo.getAllUsers();
    res.status(200).json({
      status: true,
      message: "You can run, but you can't hide!",
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// register new user
// POST http://localhost:3000/api/user/registo
registerUser = async function (req, res) {
  try {
    const data = req.body;
    const newUser = await userRepo.registerUser(data);

    res.status(200).json({
      status: true,
      result: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};
/*
{
    "nome": "Raging Frog",
    "email": "frog@frog.com",
    "password": "cliente",
    "telefone": "912345678",
}
 */

// user login
// POST http://localhost:3000/api/user/login
loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const loginResult = await userRepo.loginUser(email, password);
    if (!loginResult) {
      return res.status(401).json({
        status: false,
        message: "Autenticação falhou",
      });
    }
    res.status(200).json({
      status: true,
      message: "Autenicação com sucesso",
      ...loginResult,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// Get User By Token - para o user ver o seu próprio perfil
// GET http://localhost:3000/api/user/byToken
getUserByToken = async (req, res) => {
  try {
    // Obter o id do user a partir do token
    const userID = req.user.id;
    const user = await userRepo.getUserByToken(userID);
    if (!user) {
      return res.status(204).json({ error: "User não encontrado" });
    }

    // Retornar os dados do user
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      rating: user.rating,
    };
    return res.status(200).json({
      message: "Sucesso, getUserByToken",
      data: userData,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Erro getUserByToken: " + err.message,
    });
  }
};

// Get One User (by ID)
// GET http://localhost:3000/api/user/:id
getUserById = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await userRepo.getOneUser(userID);

    if (!user) {
      return res.status(404).json({
        error: "User não encontrado",
      });
    }

    return res.status(200).json({
      data: user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Erro getUserById: " + err.message,
    });
  }
};

// user logout
// POST http://localhost:3000/api/user/logout
logoutUser = async function (req, res) {
  try {
    const token = req.token;
    // Add the token to the blacklist
    tokenBlacklist.addTokenToBlacklist(token);
    res.status(200).json({
      status: true,
      message: "Logout com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// PATCH http://localhost:3000/api/user/rating
updateUserRating = async (userID, rating) => {
  try {
    const user = await userRepo.updateUserRating(userID, rating);

    if (!user) {
      return { status: 404, data: { error: "User não encontrado" } };
    }

    return { status: 200, data: { user, success: true } };
  } catch (err) {
    return {
      status: 500,
      data: { error: "Erro updateUserRating: " + err.message },
    };
  }
};

// PATCH http://localhost:3000/api/user/change-password
changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    // Verificar se a senha atual está correta
    const isMatch = await userRepo.verifyUserPassword(userId, currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Password incorreta" });
    }

    // Atualizar a senha no banco de dados
    await userRepo.updateUserPasswordById(userId, newPassword);

    res.status(200).json({ message: "Password atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro a mudar password: " + err.message });
  }
};

//função usada pelos admin para editar Role e Isactive
// PATCH http://localhost:3000/api/user/editar/:email
editUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { tipo, eAtivo } = req.body;

    const updatedUser = await userRepo.editUserByEmail(userEmail, {
      tipo,
      eAtivo,
    });

    if (!updatedUser) {
      return res.status(204).json({ error: "Email errado!" });
    }

    const responseData = {
      id: updatedUser.id,
      nome: updatedUser.nome,
      email: updatedUser.email,
      tipo: updatedUser.tipo,
      eAtivo: updatedUser.eAtivo,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json({
      status: true,
      message: "Informações atualizadas",
      data: responseData,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Erro ao atualizar user: " + err.message,
    });
  }
};

// PATCH http://localhost:3000/api/user/forget
forgetUserByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const forgotten = await userRepo.forgetUser(userId);

    if (!forgotten) {
      return res.status(204).json({ error: "User não encontrado" });
    }
    res.status(200).json({
      status: true,
      message: "User esquecido com sucesso",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Erro ao esquecer o user: " + err.message,
    });
  }
};
  // DELETE http://localhost:3000/api/user/:id
  deleteUser = async (req, res) => {
    try {
      const userID = req.params.id;
      const isDeleted = await userRepo.deleteUser(userID);

      if (!isDeleted) {
        return res.status(204).json({ error: "User não encontrado" });
      }
      res.status(200).json({
        status: true,
        message: "User eliminado com sucesso",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: "Erro a eliminar o user: " + err.message,
      });
    }
  };

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getUserByToken,
  getUserById,
  logoutUser,
  updateUserRating,
  changePassword,
  editUserByEmail,
  forgetUserByToken,
  deleteUser,
};
