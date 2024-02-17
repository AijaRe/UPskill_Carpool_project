const Candidatura = require("../models/candidatura");
const OfertaBoleia = require("../models/ofertaBoleia");
const userRepo = require("../repositories/userRepo");

const candidaturaRepo = {
  getUserCandidaturas: async (userId) => {
    try {
      const currentDate = new Date();
      const candidaturas = await Candidatura.find({
        passageiro: userId,
        data: { $gte: currentDate },
        estado: { $in: ["pendente", "rejeitada"] },
      });
      // Populate additional fields for each candidatura
      const prettyCandidaturas = await Promise.all(
        candidaturas.map(async (candidatura) => {
          // Fetch ofertaBoleia details
          const ofertaBoleiaDetails = await OfertaBoleia.findById(
            candidatura.ofertaBoleia
          );
          if (!ofertaBoleiaDetails) {
            console.error(
              "ofertaBoleiaDetails da candidatura não existe:",
              candidatura._id
            );
            return null;
          }
          // Fetch condutor details using Sequelize
          const condutorDetails = await userRepo.getUserInfo(
            ofertaBoleiaDetails.condutor
          );
          if (!condutorDetails) {
            console.error(
              "condutorDetails da candidatura não existe:",
              candidatura._id
            );
            return null;
          }
          // Extract necessary fields
          const estado = candidatura.estado;
          const id = candidatura._id;
          const { partidaMunicipio, destinoMunicipio, data } =
            ofertaBoleiaDetails;
          const { nome, rating, nAvaliacoes } = condutorDetails;

          // Combine all details
          return {
            id: id,
            partida: partidaMunicipio,
            destino: destinoMunicipio,
            data: data,
            estado: estado,
            nomeCond: nome,
            ratingCond: rating,
            nAvaliacoesCond: nAvaliacoes,
          };
        })
      );

      return prettyCandidaturas;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  createCandidatura: async (data) => {
    try {
      const candidatura = new Candidatura(data);
      await candidatura.save();
      return candidatura;
    } catch (err) {
      throw new Error(err);
    }
  },

  getCondutorCandidaturas: async (userId) => {
    try {
      //Find all ofertaBoleia where the user is the condutor
      const ofertasBoleia = await OfertaBoleia.find({ condutor: userId });
      // Get the IDs of the ofertaBoleia objects
      const ofertaBoleiaIds = ofertasBoleia.map((oferta) => oferta._id);
      // Find all candidaturas with pendidng status and ofertaBoleiaIds
      const currentDate = new Date();
      const candidaturas = await Candidatura.find({
        estado: "pendente",
        cancelada: false,
        ofertaBoleia: { $in: ofertaBoleiaIds },
        data: { $gte: currentDate },
      });
      // Populate additional fields for each candidatura
      const prettyCandidaturas = await Promise.all(
        candidaturas.map(async (candidatura) => {
          // Fetch ofertaBoleia details
          const ofertaBoleiaDetails = await OfertaBoleia.findById(
            candidatura.ofertaBoleia
          );
          // Fetch condutor details using Sequelize
          const passageiroDetails = await userRepo.getUserInfo(
            candidatura.passageiro
          );

          // Extract necessary fields
          const candidaturaEstado = candidatura.estado;
          const id = candidatura._id;
          const { partidaMunicipio, destinoMunicipio, data } =
            ofertaBoleiaDetails;
          const { nome, rating, nAvaliacoes } = passageiroDetails;

          // Combine all details
          return {
            id: id,
            partida: partidaMunicipio,
            destino: destinoMunicipio,
            data: data,
            estado: candidaturaEstado,
            nomePass: nome,
            ratingPass: rating,
            nAvaliacoesPass: nAvaliacoes,
          };
        })
      );

      return prettyCandidaturas;
    } catch (error) {
      throw error;
    }
  },

  changeCandidaturaStatus: async (id, estado) => {
    try {
      const candidatura = await Candidatura.findById(id);
      if (!candidatura) {
        throw new Error("Candidatura não encontrada");
      }
      const updatedCandidatura = await Candidatura.findByIdAndUpdate(
        id,
        { $set: { estado } }, // Update only estado field
        { new: true } // Return the modified document
      );
      if (!updatedCandidatura) {
        throw new Error("Erro ao atualizar candidatura");
      }

      return updatedCandidatura;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  changePendingToRejected: async (ofertaBoleiaId) => {
    try {
      const filter = { ofertaBoleia: ofertaBoleiaId, estado: "pendente" };
      const update = { estado: "rejeitada" };

      const result = await Candidatura.updateMany(filter, update);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  cancelCandidatura: async (id, userId) => {
    try {
      const currentDate = new Date();
      const candidatura = await Candidatura.findById(id);

      if (!candidatura) {
        throw new Error("Candidatura não encontrada");
      }
      if (
        candidatura.passageiro !== userId ||
        candidatura.estado !== "pendente" ||
        new Date(candidatura.data) <= currentDate
      ) {
        throw new Error(
          "Não autorizado ou condições não atendidas para cancelar a candidatura"
        );
      }

      candidatura.cancelada = true;
      await candidatura.save();
      return candidatura;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

module.exports = candidaturaRepo;
