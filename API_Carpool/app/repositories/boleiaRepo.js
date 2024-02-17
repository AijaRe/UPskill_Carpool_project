const Boleia = require("../models/boleia");
const OfertaBoleia = require("../models/ofertaBoleia");
const userRepo = require("../repositories/userRepo");

const boleiaRepo = {
  // Function to create a boleia
  createBoleia: async (data) => {
    try {
      const boleia = new Boleia(data);
      await boleia.save();
    } catch (err) {
      throw new Error(err);
    }
  },

  // Generic function to get boleias based on a query
  getBoleias: async (query) => {
    try {
      const boleias = await Boleia.find(query);
      return boleias;
    } catch (err) {
      console.error("Error retrieving boleias: ", err.message);
      throw new Error(err);
    }
  },

  // ver uma boleia por id se for passageiro ou condutor
  getOneBoleia: async (id) => {
    return Boleia.findById(id);
  },

  // ver boleias de um user (seja condutor ou passageiro)
  getBoleiasByUser: async (userId) => {
    try {
      const dataAtual = new Date();
      const boleias = await Boleia.find({
        $or: [{ condutor: userId }, { passageiro: userId }],
        data: { $gte: dataAtual },
        terminado: false,
      }).populate("ofertaBoleia");

      const prettyBoleias = await Promise.all(
        boleias.map(async (boleia) => {
          const ofertaBoleiaDetails = boleia.ofertaBoleia;

          // Verifica se o usuário é o condutor ou o passageiro da boleia
          let userInfo = null;
          if (userId === boleia.condutor) {
            userInfo = await userRepo.getUserInfo(boleia.passageiro);
          } else if (userId === boleia.passageiro) {
            userInfo = await userRepo.getUserInfo(boleia.condutor);
          }

          // Combina todos os detalhes
          return {
            id: boleia._id,
            carro: ofertaBoleiaDetails.carro,
            matricula: ofertaBoleiaDetails.matricula,
            cor: ofertaBoleiaDetails.cor,
            partida: ofertaBoleiaDetails.partidaMunicipio,
            destino: ofertaBoleiaDetails.destinoMunicipio,
            cancelada: boleia.cancelado,
            data: boleia.data,
            nome: userInfo.nome,
            rating: userInfo.rating,
            nAvaliacoes: userInfo.nAvaliacoes,
            telefone: userInfo.telefone,
          };
        })
      );

      return prettyBoleias;
    } catch (err) {
      console.error("Erro ao devolver boleias: ", err.message);
      throw new Error(err);
    }
  },

  // Função para obter boleias passadas de um user
  getBoleiasDoUsuario: async (userId) => {
    try {
      const dataAtual = new Date();
      const boleias = await Boleia.find({
        $or: [{ condutor: userId }, { passageiro: userId }],
        data: { $lt: dataAtual }
      }).populate('ofertaBoleia');

      const prettyBoleias = await Promise.all(
        boleias.map(async (boleia) => {
          const ofertaBoleiaDetails = boleia.ofertaBoleia;

          const condutorInfo = await userRepo.getUserInfo(boleia.condutor);

          const passageiroInfo = await userRepo.getUserInfo(boleia.passageiro);

          return {
            id: boleia._id,
            avaliacaoCondutor: boleia.avCondutor,
            avaliacaoPassageiro: boleia.avPassageiro,
            cancelada: boleia.cancelado,
            carro: ofertaBoleiaDetails.carro,
            partida: ofertaBoleiaDetails.partidaMunicipio,
            destino: ofertaBoleiaDetails.destinoMunicipio,
            data: boleia.data,
            nomeCondutor: condutorInfo.nome,
            nomePassageiro: passageiroInfo.nome
          };
        })
      );

      return prettyBoleias;
    } catch (err) {
      console.error('Erro ao devolver boleias: ', err.message);
      throw new Error(err);
    }
  },

  // ver boleias por terminar
  getBoleiasPorTerminar: async (userId) => {
    try {
      const dataAtual = new Date();
      const boleiasPorTerminar = await Boleia.find({
        $or: [{ condutor: userId }, { passageiro: userId }],
        terminado: false,
        cancelado: false,
        data: { $lte: dataAtual },
      });
      // Populate additional fields for each boleia
      const prettyBoleiasPorTerminar = await Promise.all(
        boleiasPorTerminar.map(async (boleia) => {
          // Extract necessary fields from ofertaBoleia
          const { partidaMunicipio, destinoMunicipio, data } =
            await OfertaBoleia.findById(boleia.ofertaBoleia);

          const id = boleia._id;
          // Fetch details of the other person involved
          const isUserCondutor = userId === boleia.condutor;

          let otherPartyDetails = null;
          if (isUserCondutor) {
            // If the user is the condutor, fetch passageiro details
            otherPartyDetails = await userRepo.getUserInfo(boleia.passageiro);
          } else {
            // If the user is the passageiro, fetch condutor details
            otherPartyDetails = await userRepo.getUserInfo(boleia.condutor);
          }
          // Extract necessary fields from other party details
          const nome = otherPartyDetails ? otherPartyDetails.nome : null;

          // Combine all details
          const returnObject = {
            id: id,
            partida: partidaMunicipio,
            destino: destinoMunicipio,
            data: data,
          };
          // Add the appropriate field based on the user role
          returnObject[isUserCondutor ? 'passageiroNome' : 'condutorNome'] = nome;
          return returnObject;
        })
      );

      return prettyBoleiasPorTerminar;
    } catch (err) {
      console.error("Error retrieving boleias por terminar: ", err.message);
      throw new Error(err);
    }
  },

  getBoleiasPorAvaliar: async (userId) => {
    try {
      const dataAtual = new Date();
      const boleiasPorAvaliar = await Boleia.find({
        $or: [
          {
            condutor: userId,
            terminado: true,
            avPassageiro: null,
            cancelado: false,
            data: { $lt: dataAtual },
          },
          {
            passageiro: userId,
            terminado: true,
            avCondutor: null,
            cancelado: false,
            data: { $lt: dataAtual },
          },
        ],
      });
      // Populate additional fields for each boleia
      const prettyBoleiasPorAvaliar = await Promise.all(
        boleiasPorAvaliar.map(async (boleia) => {
          // Extract necessary fields from ofertaBoleia
          const { partidaMunicipio, destinoMunicipio, data } =
            await OfertaBoleia.findById(boleia.ofertaBoleia);

          const id = boleia._id;
          // Fetch details of the other person involved
          let otherPartyDetails = null;
          if (userId === boleia.passageiro) {
            // If the user is the passageiro, fetch condutor details
            otherPartyDetails = await userRepo.getUserInfo(boleia.condutor);
          } else if (userId === boleia.condutor) {
            // If the user is the condutor, fetch passageiro details
            otherPartyDetails = await userRepo.getUserInfo(boleia.passageiro);
          }

          // Extract necessary fields from other party details
          const nome = otherPartyDetails ? otherPartyDetails.nome : null;

          // Combine all details
          return {
            id: id,
            partida: partidaMunicipio,
            destino: destinoMunicipio,
            data: data,
            nomePorAvaliar: nome,
          };
        })
      );

      return prettyBoleiasPorAvaliar;
    } catch (err) {
      console.error("Error retrieving boleias por avaliar: ", err.message);
      throw new Error(err);
    }
  },

  avaliarBoleia: async (boleiaId, userId, avaliacao) => {
    try {
      const boleia = await boleiaRepo.getOneBoleia(boleiaId);
      if (!boleia) {
        throw new Error("Boleia não encontrada");
      }
      if (boleia.terminado !== true) {
        throw new Error("Boleia tem de estar terminada para ser avaliada");
      }
      //if user is driver, update passenger rating
      if (userId === boleia.condutor && boleia.avPassageiro === null) {
        await boleiaRepo.patchBoleia(
          { _id: boleiaId },
          { avPassageiro: avaliacao }
        );
        await updateUserRating(boleia.passageiro, avaliacao);
        //if user is passenger, update driver rating
      } else if (userId === boleia.passageiro && boleia.avCondutor === null) {
        await boleiaRepo.patchBoleia(
          { _id: boleiaId },
          { avCondutor: avaliacao }
        );
        await updateUserRating(boleia.condutor, avaliacao);
      } else {
        throw new Error("Invalid conditions to rate the boleia");
      }
    } catch (err) {
      console.error("Error rating boleia: ", err.message);
      throw new Error(err);
    }
  },

  // Terminar boleia com a mesma ofertaBoleia(id)
  terminarBoleia: async (ofertaBoleia, userId) => {
    try {
      const boleiasAtualizadas = await Boleia.updateMany(
        {
          ofertaBoleia: ofertaBoleia,
          condutor: userId,
          terminado: false,
          cancelado: false,
          data: { $lt: new Date() },
        },
        { $set: { terminado: true } }
      );

      return boleiasAtualizadas;
    } catch (err) {
      console.error("Error terminating boleias: ", err.message);
      throw new Error(err);
    }
  },

  // Function to update a boleia
  patchBoleia: async (query, update) => {
    try {
      const updatedBoleia = await Boleia.findOneAndUpdate(query, update, {
        new: true,
      });
      return updatedBoleia;
    } catch (err) {
      throw new Error(err);
    }
  },

  // Function to delete a boleia
  deleteBoleia: async (query) => {
    try {
      const deletedBoleia = await Boleia.findOneAndDelete(query);
      return deletedBoleia;
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = boleiaRepo;
