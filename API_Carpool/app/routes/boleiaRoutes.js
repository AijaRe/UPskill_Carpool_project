const express = require("express");
const router = express.Router();
const boleiaController = require("../controllers/boleiaController");
const verifyToken = require("../controllers/middleware");
const { celebrate, Joi, Segments } = require("celebrate");

// POST criar uma boleia
router.post("/", verifyToken(["cliente"]), boleiaController.criarBoleia);

// GET ler boleias por terminar
router.get(
  "/nao/terminado",
  verifyToken(["cliente"]),
  boleiaController.boleiasPorTerminar
);

// GET ler boleias por user
router.get("/", verifyToken(["cliente"]), boleiaController.boleiasPorUser);

// GET ler boleias por avaliar e que estao terminadas
router.get(
  "/nao/avaliada",
  verifyToken(["cliente"]),
  boleiaController.boleiasPorAvaliar
);

// PATCH avaliar uma boleia
router.patch(
  "/:_id/avaliar",
  verifyToken(["cliente"]),
  boleiaController.avaliarBoleia
);

// PATCH terminar uma boleia
router.patch(
  "/:_id/terminar",
  verifyToken(["cliente"]),
  boleiaController.terminarBoleia
);

// Rota para obter boleias do usuário
router.get('/minhasBoleias', verifyToken(['cliente']), boleiaController.getBoleiasPassadasUser);

// PATCH cancelar uma boleia
//router.get("/:_id", verifyToken(['cliente']), boleiaController.cancelarBoleia);

module.exports = router;