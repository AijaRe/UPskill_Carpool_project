const OfertaBoleia = require("../models/ofertaBoleia");
const userRepo = require("../repositories/userRepo");
const Candidatura = require("../models/candidatura");
const Boleia = require("../models/boleia");
const userController = require("../controllers/userController");

const ofertaBoleiaRepo = {
  criarOferta: async (dadosOferta) => {
    try {
      const novaOferta = new OfertaBoleia(dadosOferta);
      return await novaOferta.save();
    } catch (error) {
      throw new Error("Erro ao criar oferta de boleia: " + error.message);
    }
  },

  atualizarOferta: async (id, dadosAtualizacao) => {
    try {
      return await OfertaBoleia.findByIdAndUpdate(id, dadosAtualizacao, {
        new: true,
      });
    } catch (error) {
      throw new Error("Erro ao atualizar oferta de boleia: " + error.message);
    }
  },

  ofertaPorId: async (id) => {
    try {
      return await OfertaBoleia.findById(id);
    } catch (error) {
      throw new Error(
        "Erro ao procurar oferta de boleia por ID: " + error.message
      );
    }
  },

  ofertasPorCondutorComPassageiros: async (condutor) => {
    try {
      const ofertas = await OfertaBoleia.find({ condutor: condutor, cancelada: false});
      const ofertasComPassageiros = await Promise.all(ofertas.map(async (oferta) => {
        const boleias = await Boleia.find({ ofertaBoleia: oferta._id });
        const condutorInfo = await userRepo.getUserInfo(condutor);

        const passageiros = await Promise.all(boleias.map(async (boleia) => {
          const passageiroInfo = await userRepo.getUserInfo(boleia.passageiro);
          return passageiroInfo ? {
            nome: passageiroInfo.nome,
            rating: passageiroInfo.rating,
            telefone: passageiroInfo.telefone,
          } : null;
        }));

        // Estruturação dos dados da oferta
        return {
          _id: oferta._id,
          partidaMunicipio: oferta.partidaMunicipio,
          destinoMunicipio: oferta.destinoMunicipio,
          data: oferta.data,
          lugares: oferta.lugares,
          matricula: oferta.matricula,
          carro: oferta.carro,
          cancelada: oferta.cancelada,
          condutor: condutorInfo.nome,
          passageiros: passageiros.filter(p => p !== null),
        };
      }));

      return ofertasComPassageiros;
    } catch (error) {
      throw new Error("Erro ao procurar ofertas de boleia por condutor: " + error.message);
    }
  },

  getLocalOfertas: async (partidaMunicipio, destinoMunicipio, data) => {
    try {
      const currentDate = new Date();

      // Se a data recebida for menor que hoje, usar a data atual
      const dataPesquisa =
        new Date(data) < currentDate ? currentDate : new Date(data);

      // Ajustar data para o início do dia da pesquisa
      const dataInicio = new Date(dataPesquisa);
      dataInicio.setHours(0, 0, 0, 0);

      // Ajustar data para o final do dia da pesquisa
      const dataFim = new Date(dataPesquisa);
      dataFim.setHours(23, 59, 59, 999);

      const ofertas = await OfertaBoleia.find({
        partidaMunicipio,
        destinoMunicipio,
        data: { $gte: dataInicio, $lte: dataFim },
        cancelada: false,
        lugares: { $gt: 0 },
      });

      const prettyOfertas = await Promise.all(
        ofertas.map(async (oferta) => {
          // Obter informações do condutor
          const userInfo = await userRepo.getUserInfo(oferta.condutor);

          // Extrair e retornar informações relevantes
          return {
            id: oferta._id,
            partidaMunicipio: oferta.partidaMunicipio,
            partidaFreguesia: oferta.partidaFreguesia,
            destinoMunicipio: oferta.destinoMunicipio,
            destinoFreguesia: oferta.destinoFreguesia,
            data: oferta.data,
            lugares: oferta.lugares,
            carro: oferta.carro,
            nome: userInfo.nome,
            rating: userInfo.rating,
            nAvaliacoes: userInfo.nAvaliacoes,
          };
        })
      );

      return prettyOfertas;
    } catch (err) {
      console.error("Erro ao obter ofertas locais: ", err.message);
      throw new Error(err);
    }
  },

  getAllOfertas: async () => {
    try {
      const currentDate = new Date();
      const ofertas = await OfertaBoleia.find({
        data: { $gte: currentDate },
        cancelada: false,
        lugares: { $gt: 0 },
      }).sort({ data: 1 });

      const prettyOfertas = await Promise.all(
        ofertas.map(async (oferta) => {
          const userInfo = await userRepo.getUserInfo(oferta.condutor);

          if (!userInfo) {
            console.error(`User-condutor não encontrado ${oferta.condutor}`);
            return null;
          }
          return {
            id: oferta._id,
            partidaMunicipio: oferta.partidaMunicipio,
            partidaFreguesia: oferta.partidaFreguesia,
            destinoMunicipio: oferta.destinoMunicipio,
            destinoFreguesia: oferta.destinoFreguesia,
            data: oferta.data,
            lugares: oferta.lugares,
            carro: oferta.carro,
            nome: userInfo.nome,
            rating: userInfo.rating,
            nAvaliacoes: userInfo.nAvaliacoes,
          };
        })
      );

      return prettyOfertas;
    } catch (err) {
      console.error("Erro ao obter todas as ofertas: ", err.message);
      throw new Error(err);
    }
  },

  cancelarOfertaBoleia: async (ofertaBoleiaId, userId) => {
    try {
      const ofertaBoleia = await OfertaBoleia.findById(ofertaBoleiaId);
      if (
        !ofertaBoleia ||
        ofertaBoleia.condutor !== userId
      ) {
        return null;
      }

      // Cancela a oferta de boleia
      ofertaBoleia.cancelada = true;
      await ofertaBoleia.save();
      // Cancela todas as candidaturas relacionadas
      await Candidatura.updateMany(
        { ofertaBoleia: ofertaBoleiaId },
        { cancelada: true },
        { rejeitada: true },
      );

      // Cancela todas as boleias relacionadas e atualiza a avaliação do condutor
      const boleias = await Boleia.find({ ofertaBoleia: ofertaBoleiaId });
      for (const boleia of boleias) {
        boleia.cancelado = true;
        await boleia.save();
        await userController.updateUserRating(boleia.condutor, 0);
      }

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  aumentarLugares: async (id) => {
    const oferta = await OfertaBoleia.findById(id);
    if (oferta) {
      oferta.lugares += 1;
      return await oferta.save();
    } else {
      throw new Error("Oferta de boleia não encontrada.");
    }
  },
};

module.exports = ofertaBoleiaRepo;
