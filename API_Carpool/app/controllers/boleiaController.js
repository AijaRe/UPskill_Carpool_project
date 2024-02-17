const boleiaModel = require("../models/boleia");
const boleiaRepo = require("../repositories/boleiaRepo");
const ofertaBoleiaController = require("../controllers/ofertaBoleiaController");
const userRepo = require("../repositories/userRepo");

const handleErrorResponse = (res, error) =>
  res.status(500).json({ error: "Error: " + error.message });

criarBoleia = async (dadosBoleia) => {
  try {
    // Os dados vêm diretamente, não mais de um objeto de requisição
    const { ofertaBoleiaId, passageiro, data, condutorId } = dadosBoleia;

    // Criar a boleia
    const novaBoleia = {
      ofertaBoleia: ofertaBoleiaId,
      data: data,
      condutor: condutorId,
      passageiro: passageiro,
      avCondutor: null,
      avPassageiro: null,
      terminado: false,
      cancelado: false,
    };

    const boleiaGuardada = await boleiaRepo.createBoleia(novaBoleia);

    return boleiaGuardada;
  } catch (error) {
    throw error;
  }
};

// Boleias futuras ainda não iniciadas pelo idtoken
boleiasPorUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const prettyBoleias = await boleiaRepo.getBoleiasByUser(userId);

    if (!prettyBoleias.length) {
      return res.status(404).json({ error: "Boleias não encontradas" });
    }

    res.status(200).json({
      message: "Boleias devolvidas com sucesso",
      data: prettyBoleias,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

//Boleias terminadas e canceladas do USER
getBoleiasPassadasUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const boleias = await boleiaRepo.getBoleiasDoUsuario(userId);

    if (!boleias.length) {
      return res.status(404).json({ message: 'Nenhuma boleia encontrada' });
    }

    res.status(200).json({
      message: 'Boleias encontradas com sucesso',
      data: boleias
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao  boleias', error: err.message });
  }
};

// boleiasPorTerminar procura boleias com terminar === false se o pedido vier de um user condutor ou user passageiro
boleiasPorTerminar = async (req, res) => {
  try {
    const userId = req.user.id;
    const boleiasPorTerminar = await boleiaRepo.getBoleiasPorTerminar(userId);

    return res.status(200).json({
      message: "Boleias por terminar devolvidas com sucesso",
      data: boleiasPorTerminar,
      success: true,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

//boleias que faltam avaliar
boleiasPorAvaliar = async (req, res) => {
  try {
    const userId = req.user.id;
    const boleiasPorAvaliar = await boleiaRepo.getBoleiasPorAvaliar(userId);

    return res.status(200).json({
      message: "Boleias por avaliar devolvidas com sucesso",
      data: boleiasPorAvaliar,
      success: true,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

avaliarBoleia = async (req, res) => {
  try {
    const boleiaId = req.params._id;
    const userId = req.user.id;

    const avaliacao = req.body.avaliacao;

    const boleiaAvaliada = await boleiaRepo.avaliarBoleia(
      boleiaId,
      userId,
      avaliacao
    );

    return res.status(200).json({
      message: "Boleia avaliada com sucesso",
      data: boleiaAvaliada,
      success: true,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

terminarBoleia = async (req, res) => {
  try {
    const userId = req.user.id;
    const boleiaId = req.params._id;
    // Check if the user is the condutor of the boleia
    const boleia = await boleiaRepo.getOneBoleia(boleiaId);
    if (!boleia || boleia.condutor !== userId) {
      return res
        .status(403)
        .json({ error: "Apenas o condutor pode alterar a boleia" });
    }

    // Check other conditions before terminating the boleia
    if (boleia.cancelado || boleia.terminado || boleia.data > new Date()) {
      return res
        .status(400)
        .json({ error: "Condições inválidas para terminar a boleia" });
    }

    // Call the repo function to terminate the boleia
    const boleiasAtualizadas = await boleiaRepo.terminarBoleia(
      boleia.ofertaBoleia,
      userId
    );
    console.log(boleia.ofertaBoleia);
    return res.status(200).json({
      message: "Boleias terminadas com sucesso",
      data: boleiasAtualizadas,
      success: true,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

cancelarBoleia = async (req, res) => {};

module.exports = {
  criarBoleia,
  boleiasPorUser,
  getBoleiasPassadasUser,
  boleiasPorTerminar,
  boleiasPorAvaliar,
  avaliarBoleia,
  terminarBoleia,
  cancelarBoleia,
};
