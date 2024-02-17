const OfertaBoleia = require("../models/ofertaBoleia");
const candidaturaRepo = require("../repositories/candidaturaRepo");
const boleiaController = require("../controllers/boleiaController");
const Candidatura = require("../models/candidatura");
const ofertaBoleiaController = require("./ofertaBoleiaController");
const mongoose = require("mongoose");

// GET http://localhost:3000/api/candidatura/minhasCandidaturas
getUserCandidaturas = async (req, res) => {
  try {
    const userId = req.user.id;
    const candidaturas = await candidaturaRepo.getUserCandidaturas(userId);

    return res.status(200).json({
      message: "minhasCandidaturas executado com sucesso",
      data: candidaturas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao obter candidaturas",
    });
  }
};
// GET http://localhost:3000/api/candidatura/paraCondutor
getCondutorCandidaturas = async (req, res) => {
  try {
    const userId = req.user.id;
    const candidaturas = await candidaturaRepo.getCondutorCandidaturas(userId);

    return res.status(200).json({
      message: "candidaturasOfertaBoleia executado com sucesso",
      data: candidaturas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao obter candidaturas",
    });
  }
};
// POST http://localhost:3000/api/candidatura/
createCandidatura = async (req, res) => {
  try {
    const ofertaBoleiaId = req.body.ofertaBoleia;
    const ofertaBoleia = await OfertaBoleia.findById(ofertaBoleiaId);

    if (!ofertaBoleia) {
      return res.status(404).json({
        message: "OfertaBoleia não encontrada",
      });
    }
    if (
      ofertaBoleia.lugares <= 0 ||
      ofertaBoleia.cancelada ||
      ofertaBoleia.data < new Date()
    ) {
      return res.status(400).json({
        message: "OfertaBoleia não disponível",
      });
    }

    const userId = req.user.id;
    if (userId === ofertaBoleia.condutor) {
      return res.status(400).json({
        message: "Não é permitido candidatar-se à sua própria oferta de boleia",
      });
    }
    // Extract the required data from the OfertaBoleia object
    const data = {
      ofertaBoleia: ofertaBoleiaId,
      passageiro: req.user.id,
      data: ofertaBoleia.data,
    };
    const newCandidatura = await candidaturaRepo.createCandidatura(data);

    return res.status(200).json({
      message: "Candidatura criada com sucesso",
      data: newCandidatura,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar candidatura",
    });
  }
};
/*
	{
		"ofertaBoleia": "65ae90e636db1dcc49cd9b59",
	}
	*/

// PATCH http://localhost:3000/api/candidatura/:id
changeCandidaturaStatus = async (req, res) => {
  try {
    const id = req.params.id;
    // Validar se o ID está no formato correto
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido fornecido" });
    }
    const estado = req.body.estado;
    const candidatura = await Candidatura.findById(id);
    if (
      !candidatura ||
      candidatura.estado !== "pendente" ||
      candidatura.cancelada
    ) {
      return res
        .status(400)
        .json({ message: "Candidatura inválida ou já processada" });
    }

    if (new Date(candidatura.data) < new Date()) {
      return res.status(400).json({ message: "Candidatura expirada" });
    }

    const ofertaBoleia = await OfertaBoleia.findById(candidatura.ofertaBoleia);
    if (
      !ofertaBoleia ||
      ofertaBoleia.cancelada ||
      ofertaBoleia.condutor !== req.user.id ||
      ofertaBoleia.lugares <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Oferta de boleia inválida ou indisponível" });
    }

    const updatedCandidatura = await candidaturaRepo.changeCandidaturaStatus(
      id,
      estado
    );

    if (estado === "aprovada") {
      let extramsg = "";
      // Preparar os dados para a criação da boleia
      const dadosBoleia = {
        ofertaBoleiaId: candidatura.ofertaBoleia,
        passageiro: candidatura.passageiro,
        data: candidatura.data,
        condutorId: req.user.id,
      };

      const boleiaGuardada = await boleiaController.criarBoleia(dadosBoleia);

      // Reduzir lugares
      await ofertaBoleiaController.reduzirLugares(
        candidatura.ofertaBoleia.toString()
      );

      if (ofertaBoleia.lugares === 1) {
        await candidaturaRepo.changePendingToRejected(
          ofertaBoleia._id.toString()
        );
        extramsg = ", todas as outras candidaturas serão rejeitadas.";
      } else {
        extramsg = ".";
      }

      return res.status(200).json({
        message: "Candidatura aprovada e boleia criada com sucesso" + extramsg,
        data: { candidatura, boleia: boleiaGuardada },
      });
    } else {
      return res.status(200).json({
        message: "Candidatura atualizada com sucesso",
        data: updatedCandidatura,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao atualizar candidatura",
    });
  }
};
/*
{
	"estado": "aprovada"
}
*/

// call this function:
// await candidaturaController.changePendingToRejected(ofertaBoleiaId, res);
changePendingToRejected = async (ofertaBoleiaId, res) => {
  try {
    const result = await candidaturaRepo.changePendingToRejected(
      ofertaBoleiaId
    );
    return res.status(200).json({
      message: "Candidaturas rejeitadas",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro a rejeitar candidaturas",
    });
  }
};

cancelCandidatura = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await candidaturaRepo.cancelCandidatura(id, userId);
    return res
      .status(200)
      .json({ message: "Candidatura cancelada com sucesso" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao cancelar candidatura: " + error.message });
  }
};

module.exports = {
  getUserCandidaturas,
  getCondutorCandidaturas,
  createCandidatura,
  changeCandidaturaStatus,
  changePendingToRejected,
  cancelCandidatura,
};
