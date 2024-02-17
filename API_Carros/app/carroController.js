const CarroRepo = require("./carroRepo");
const carroController = {
  // Obter todos os carros
  getGeral: async function (req, res) {
    try {
      const carros = await CarroRepo.getGeral();
      res.json(carros);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // Obter todas as marcas de carros
  getTodasMarcas: async function (req, res) {
    try {
      const marcas = await CarroRepo.getTodasMarcas();
      res.json(marcas);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // Obter modelos de uma marca específica
  getMarca: async function (req, res) {
    try {
      const marca = req.params.marca;
      const modelos = await CarroRepo.getMarca(marca);
      if (modelos.length === 0) {
        res.status(404).json({ error: "Marca não encontrada" });
      } else {
        res.json(modelos);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // Obter um carro específico pelo ID
  getId: async function (req, res) {
    try {
      const _id = req.params._id;
      const carroC = await CarroRepo.getId(_id);
      if (!carroC) {
        res.status(404).json({ error: "id não encontrado" });
      } else {
        res.json(carroC);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // Obter um carro específico por marca e modelo
  getCarro: async function (req, res) {
    try {
      const marca = req.params.marca;
      const modelo = req.params.modelo;
      const carrosC = await CarroRepo.getCarro(marca, modelo);
      if (!carrosC) {
        res.status(404).json({ error: "carro não encontrado" });
      } else {
        res.json(carrosC);
      }
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // Atualizar um carro específico por marca e modelo
  putCarro: async function (req, res) {
    try {
      const { marca, modelo } = req.params;
      const carroData = req.body;
      const result = await CarroRepo.putCarro(marca, modelo, carroData);
      if (!result) {
        res.status(404).json({ error: "carro não encontrado" });
      } else {
        res.json({ success: true, message: "Carro atualizado com sucesso." });
      }
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  postCarro: async function (req, res) {
    try {
      const { marca, modelo } = req.body;
      // tratar espaços em branco como se fossem vazio
      const regex = /^[A-Za-z0-9][A-Za-z0-9\s]*$/;
      if (!regex.test(marca) || !regex.test(modelo)) {
        return res
          .status(400)
          .json({
            error: "A marca e o modelo devem começar com uma letra ou numero.",
          });
      }
      const novoCarro = await CarroRepo.postCarro(marca, modelo);
      res.status(201).json(novoCarro);
    } catch (err) {
      console.error("Erro ao adicionar carro:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = carroController;
