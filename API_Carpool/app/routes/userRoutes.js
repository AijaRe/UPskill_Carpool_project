const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const verifyToken = require("../controllers/middleware");
const userController = require("../controllers/userController");

// Get all users
router.get("/", verifyToken(['admin']), userController.getAllUsers);

// Get user by token
router.get("/byToken", verifyToken(["cliente"]), userController.getUserByToken);

// Get user (by its ID)
router.get(
  "/:id",
  verifyToken(["admin", "cliente"]),
  userController.getUserById
);

// Register user
router.post("/registo", userController.registerUser);

// Login user
router.post(
  "/login",
  celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  userController.loginUser
);

// Logout user
router.post(
  "/logout",
  verifyToken(["admin", "cliente"]),
  userController.logoutUser
);

// Update user rating and nAvaliacoes (receive rating and userId)
router.patch(
  "/rating",
  verifyToken(["admin", "cliente"]),
  userController.updateUserRating
);

//editar a própria palavra pass
router.patch(
  "/change-password",
  verifyToken(["admin", "cliente"]),
  celebrate({
    body: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }),
  }),
  userController.changePassword
);

// Para admin: mudar o tipo e eAtivo de um user (by email)
router.patch(
  "/editar/:email",
  verifyToken(["admin"]),
  userController.editUserByEmail
);

// Delete lógico para o próprio user (by token)
router.patch(
  "/forget",
  verifyToken(["cliente"]),
  userController.forgetUserByToken
);

// Delete user by ID (for testing purposes)
router.delete("/:id", verifyToken(['admin']), userController.deleteUser);

module.exports = router;
