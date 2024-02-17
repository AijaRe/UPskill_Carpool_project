const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const carroController = require("./carroController");
const verifyToken = require("./middleware");

// Rota para obter todos os carros
router.get("/", verifyToken(["cliente", "admin"]), carroController.getGeral);

// Rota para obter todas as marcas de carros
router.get(
  "/marcas",
  verifyToken(["cliente", "admin"]),
  carroController.getTodasMarcas
);

// Rota para obter modelos de uma marca específica
router.get(
  "/marca/:marca",
  verifyToken(["cliente", "admin"]),
  carroController.getMarca
);

// Rota para obter um carro pelo seu ID
router.get(
  "/id/:_id",
  verifyToken(["cliente", "admin"]),
  carroController.getId
);

// Rota para obter um carro específico por marca e modelo
router.get(
  "/carro/:marca/:modelo",
  verifyToken(["cliente", "admin"]),
  carroController.getCarro
);

// Rota para atualizar um carro específico por marca e modelo
router.put(
  "/:marca/:modelo",
  verifyToken(["admin"]),
  celebrate({
    body: Joi.object({
      marca: Joi.string().required(),
      modelo: Joi.string().required(),
    }),
  }),
  carroController.putCarro
);

// Rota para criar um novo carro
router.post(
  "/",
  verifyToken(["admin"]),
  celebrate({
    body: Joi.object({
      marca: Joi.string().required(),
      modelo: Joi.string().required(),
    }),
  }),
  carroController.postCarro
);

module.exports = router;
