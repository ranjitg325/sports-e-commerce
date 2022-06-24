const jwt = require("jsonwebtoken");

exports.authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);
  
	jwt.verify(token, "sports-e-commerce", (err, user) => {
	  if (err) return res.status(403).json(err);
  
	  req.user = user;
	});
  
	next();
  };