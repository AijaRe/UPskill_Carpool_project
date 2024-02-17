const Carros = require("./carroModel");

// Obter todos os carros
// Esta função retorna todos os carros registrados na base de dados
async function getGeral() {
  try {
    return await Carros.find().exec();
  } catch (err) {
    // Caso ocorra um erro, ele será capturado e uma mensagem de erro será lançada
    throw new Error("Erro ao obter todos os carros: " + err.message);
  }
}

// Obter todas as marcas distintas
// Esta função retorna todas as marcas de carros diferentes existentes na base de dados
async function getTodasMarcas() {
  try {
    const carros = await Carros.distinct("marca").exec();
    const marcas = carros.map((marca) => ({ marca }));
    return marcas;
  } catch (err) {
    // Em caso de erro, uma mensagem específica será gerada
    throw new Error("Erro ao obter todas as marcas: " + err.message);
  }
}

// Obter modelos por marca específica
// Esta função retorna todos os modelos de uma marca específica
async function getMarca(marca) {
  try {
    const modelos = await Carros.find({
      marca: new RegExp("^" + marca + "$", "i"),
    })
      .select("modelo")
      .exec();

    return modelos.map((carro) => ({ modelo: carro.modelo }));
  } catch (err) {
    // Trata erros que podem ocorrer durante a busca
    throw new Error(
      "Erro ao obter modelos da marca " + marca + ": " + err.message
    );
  }
}

// Obter carro por ID
// Esta função procura um carro específico usando seu ID
async function getId(_id) {
  try {
    return await Carros.findById(_id).exec();
  } catch (err) {
    // Trata erros durante a busca por ID
    throw new Error("Erro ao obter carro por ID: " + err.message);
  }
}

// Obter carro específico por marca e modelo
// Esta função busca um carro específico usando a marca e o modelo
async function getCarro(marca, modelo) {
  try {
    return await Carros.findOne({
      marca: new RegExp("^" + marca, "i"),
      modelo: new RegExp("^" + modelo, "i"),
    }).exec();
  } catch (err) {
    // Trata erros na busca por marca e modelo
    throw new Error("Erro ao obter carro específico: " + err.message);
  }
}

// Atualizar carro específico por marca e modelo
// Esta função atualiza os dados de um carro específico identificado pela marca e modelo
async function putCarro(marca, modelo, carroData) {
  try {
    return await Carros.findOneAndUpdate(
      {
        marca: new RegExp("^" + marca, "i"),
        modelo: new RegExp("^" + modelo, "i"),
      },
      { ...carroData },
      { new: true }
    ).exec();
  } catch (err) {
    // Trata erros que podem ocorrer durante a atualização
    throw new Error("Erro ao atualizar carro: " + err.message);
  }
}

async function postCarro(marca, modelo) {
  const modeloExistente = await Carros.findOne({ modelo });
  const novoCarro = new Carros({ marca, modelo });
  return novoCarro.save();
}

module.exports = {
  getGeral,
  getTodasMarcas,
  getMarca,
  getId,
  getCarro,
  putCarro,
  postCarro,
};
