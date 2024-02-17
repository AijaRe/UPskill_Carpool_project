const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const tokenBlacklist = require("../utils/tokenBlacklist");

const verifyToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não enviado!" });
    }

    // Check if the token is invalid
    if (tokenBlacklist.isTokenInvalid(token)) {
      return res.status(401).json({
        status: false,
        message: "Sem autorização: token não válido!",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user || !user.eAtivo) {
        return res.status(403).json({ message: "Conta inativa." });
      }

      const hasPermission = allowedRoles.includes(req.user.tipo);
      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Sem permissões para este acesso " });
      }

      next();
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erro na verificação do token: " + error.message });
    }
  };
};

module.exports = verifyToken;
