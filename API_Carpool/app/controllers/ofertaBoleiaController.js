const OfertaBoleia = require("../models/ofertaBoleia");
const ofertaBoleiaRepo = require("../repositories/ofertaBoleiaRepo");

const ofertaBoleiaController = {
  // Criar Oferta
  criarOferta: async (req, res) => {
    try {
      const dadosOferta = {
        ...req.body,
        condutor: req.user.id,
      };

      const ofertaSalva = await ofertaBoleiaRepo.criarOferta(dadosOferta);
      res.status(201).json(ofertaSalva);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao criar ofertaBoleia: " + error.message });
    }
  },

  // ofertas de boleia pendentes do user (token)
  ofertasUserPendentes: async (req, res) => {
    try {
      const condutor = req.user.id;
      const ofertasDoUsuarioComPassageiros = await ofertaBoleiaRepo.ofertasPorCondutorComPassageiros(
        condutor
      );

      // Filtrar apenas as ofertas ativas e pendentes
      const ofertasPendentes = ofertasDoUsuarioComPassageiros.filter(
        (oferta) => oferta.data >= new Date() && !oferta.cancelada
      );

      res.status(200).json(ofertasPendentes);
    } catch (error) {
      res.status(500).json({
        message: "Erro a encontrar ofertas pendentes: " + error.message,
      });
    }
  },

  //ofertas de boleia terminadas do user (token)
  ofertasUserTerminadas: async (req, res) => {
    try {
      const condutor = req.user.id;
      const ofertasDoUsuario = await ofertaBoleiaRepo.ofertasPorCondutor(
        condutor
      );

      // Filtrar apenas as ofertas canceladas ou com data<hoje
      const ofertasTerminadas = ofertasDoUsuario.filter(
        (oferta) => oferta.cancelada || oferta.data < new Date()
      );

      res.status(200).json(ofertasTerminadas);
    } catch (error) {
      res.status(500).json({
        message: "Erro a encontrar ofertas terminadas: " + error.message,
      });
    }
  },

  //Ofertas de boleia por Municipio
  ofertasLocal: async (req, res) => {
    try {
      const { partidaMunicipio, destinoMunicipio, data } = req.query;
      const prettyOfertas = await ofertaBoleiaRepo.getLocalOfertas(
        partidaMunicipio,
        destinoMunicipio,
        data
      );

      if (!prettyOfertas.length) {
        return res.status(404).json({ message: "Nenhuma oferta encontrada" });
      }

      res.status(200).json({
        message: "Ofertas locais encontradas",
        data: prettyOfertas,
      });
    } catch (err) {
      res.status(500).json({
        message: "Erro ao pesquisar ofertas locais",
        error: err.message,
      });
    }
  },

  // Todas Ofertas de Boleia Disponíveis
  todasOfertas: async (req, res) => {
    try {
      const prettyOfertas = await ofertaBoleiaRepo.getAllOfertas();

      if (!prettyOfertas.length) {
        return res.status(404).json({ message: "Nenhuma oferta disponível" });
      }

      res.status(200).json({
        message: "Todas as ofertas disponíveis encontradas",
        data: prettyOfertas,
      });
    } catch (err) {
      res.status(500).json({
        message: "Erro ao pesquisar todas as ofertas",
        error: err.message,
      });
    }
  },

  // Reduzir o número de lugares em uma reserva
  reduzirLugares: async (ofertaBoleiaId) => {
    try {
      const oferta = await OfertaBoleia.findById(ofertaBoleiaId);
      if (!oferta) {
        throw new Error("Oferta de boleia não encontrada.");
      }
      if (oferta.lugares > 0) {
        oferta.lugares -= 1;
        const ofertaAtualizada = await oferta.save();
        return ofertaAtualizada;
      } else {
        throw new Error("Não há lugares disponíveis para reduzir.");
      }
    } catch (error) {
      throw error; // Lançar o erro para ser capturado no contexto de chamada
    }
  },

  cancelarOfertaBoleia: async (req, res) => {
    try {
      const ofertaBoleiaId = req.params.id;
      const userId = req.user.id;

      const cancelamento = await ofertaBoleiaRepo.cancelarOfertaBoleia(
        ofertaBoleiaId,
        userId
      );

      if (!cancelamento) {
        return res
          .status(404)
          .json({ error: "Oferta de boleia não encontrada" });
      }

      res.status(200).json({
        message: "Oferta de boleia cancelada com sucesso",
        success: true,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao cancelar a oferta de boleia: " + err.message });
    }
  },

  //Aumentar o número de lugares em uma reserva
  aumentarLugares: async (req, res) => {
    try {
      const id = req.params.id;
      const ofertaAtualizada = await ofertaBoleiaRepo.aumentarLugares(id);
      res.status(200).json(ofertaAtualizada);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ofertaBoleiaController;
