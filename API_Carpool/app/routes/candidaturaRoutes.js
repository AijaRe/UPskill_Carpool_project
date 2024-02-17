const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const verifyToken = require("../controllers/middleware");
const candidaturaController = require("../controllers/candidaturaController");

//validar entrada para aprovar/rejeitar candidaturas
const changeCandidaturaStatusSchema = {
  [Segments.BODY]: Joi.object().keys({
    estado: Joi.string().valid("aprovada", "rejeitada").required(),
  }),
};

// Create candidatura
router.post(
  "/",
  verifyToken(["cliente", "admin"]),
  celebrate({
    body: Joi.object({
      ofertaBoleia: Joi.string().required(),
    }),
  }),
  candidaturaController.createCandidatura
);

// Get canditaturas pendentes & rejeitadas by user id
router.get(
  "/minhasCandidaturas",
  verifyToken(["cliente", "admin"]),
  candidaturaController.getUserCandidaturas
);

// Get candidaturas pendentes duma ofertaBoleia pelo id do condutor
router.get(
  "/paraCondutor",
  verifyToken(["cliente", "admin"]),
  candidaturaController.getCondutorCandidaturas
);

// Change candidatura status
router.patch(
  "/:id",
  verifyToken(["admin", "cliente"]),
  celebrate(changeCandidaturaStatusSchema),
  candidaturaController.changeCandidaturaStatus
);

// Cancelar candidatura
router.patch(
  "/cancelar/:id",
  verifyToken(["admin", "cliente"]),
  candidaturaController.cancelCandidatura
);

// Turn all candidaturas that are pendente to rejeitada
//  changePendingToRejected(ofertaBoleiaId, res)

module.exports = router;
