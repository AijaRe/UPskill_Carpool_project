const express = require("express");
const router = express.Router();
const ofertaBoleiaController = require("../controllers/ofertaBoleiaController");
const verifyToken = require("../controllers/middleware");
const { celebrate, Joi, Segments } = require("celebrate");

//validações usadas nas routes
//validaçao para criar
const criarOfertaSchema = {
  [Segments.BODY]: Joi.object().keys({
    carro: Joi.string().required(), // ID do carro
    matricula: Joi.string()
      .pattern(/^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/)
      .required(), // Matrícula do carro
    cor: Joi.string().required(), // Cor do carro
    partidaMunicipio: Joi.string().required(), // Municipio de partida
    partidaFreguesia: Joi.string().required(), // Freguesia de partida
    destinoMunicipio: Joi.string().required(), // Municipio de destino
    destinoFreguesia: Joi.string().required(), // Freguesia de destino
    data: Joi.date().greater("now").required(), // Data futura
    lugares: Joi.number().integer().min(1).required(), // Número de lugares
  }),
};

// validação para cancelar Oferta
const cancelarOfertaSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

// //validar procurar ofertas por locais
// const ofertasLocalSchema = {
//     [Segments.QUERY]: Joi.object().keys({
//         // partidaMunicipio: Joi.string().required(),
//         // destinoMunicipio: Joi.string().required(),
//         // data: Joi.date().iso().min(Joi.ref('now')).required()
//     })
// };

// Validação para reduzir lugares
const lugaresSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

// Criar Oferta check
router.post(
  "/",
  verifyToken(["cliente"]),
  celebrate(criarOfertaSchema),
  ofertaBoleiaController.criarOferta
);

// Cancelar Oferta
router.patch(
  "/cancelar/:id",
  verifyToken(["cliente"]),
  celebrate(cancelarOfertaSchema),
  ofertaBoleiaController.cancelarOfertaBoleia
);

// Ofertas Pendentes do user check //implementar
router.get(
  "/pendentes",
  verifyToken(["cliente"]),
  ofertaBoleiaController.ofertasUserPendentes
);

// Ofertas Terminadas do user check //Implementar
router.get(
  "/terminadas",
  verifyToken(["cliente"]),
  ofertaBoleiaController.ofertasUserTerminadas
);

// Ofertas por Municipios checck
// router.get('/local', celebrate(ofertasLocalSchema), ofertaBoleiaController.ofertasLocal);
router.get("/local", ofertaBoleiaController.ofertasLocal);

//todas as ofertasBoleia
router.get("/todas", ofertaBoleiaController.todasOfertas);

// Reduzir Lugares da Oferta
router.patch(
  "/reduzirLugares/:id",
  verifyToken(["cliente"]),
  celebrate(lugaresSchema),
  ofertaBoleiaController.reduzirLugares
);

// Aumentar lugar (boleia cancelada)
router.patch(
  "/aumentarLugares/:id",
  verifyToken(["cliente"]),
  celebrate(lugaresSchema),
  ofertaBoleiaController.reduzirLugares
);

module.exports = router;
