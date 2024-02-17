const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token não enviado" });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
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
