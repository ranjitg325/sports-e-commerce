const express = require('express');
const router = express.Router();


const cartController = require("../controllers/cart");
const middleware = require("../middleware/authenticateUser");

router.post("/makeOrder",middleware.authenticateToken,cartController.add_cart);

module.exports=router;