const express = require('express');
const router = express.Router();


const brandController = require("../controllers/brand");
const middleware = require("../middleware/authenticateUser");

router.post("/add/brand",middleware.authenticateToken,brandController.add_brand);


module.exports=router;