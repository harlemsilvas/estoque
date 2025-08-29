// server/middleware.js
module.exports = (req, res, next) => {
  if (req.path.startsWith("/api") && !req.path.includes("/login")) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Acesso não autorizado");

    // Verificação simulada do token
    const users = require("./db.json").users;
    const user = users.find((u) => u.token === token);
    if (!user) return res.status(403).send("Token inválido");

    req.user = user;
  }
  const jwt = require("jsonwebtoken");
  const users = require("./db.json").users;

  module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("Token não fornecido");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar se usuário ainda existe
      const user = users.find((u) => u.id === decoded.id);
      if (!user) throw new Error("Usuário não encontrado");

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
  next();
};
