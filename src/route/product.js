const express = require('express');
const router = express.Router();


const productControllers = require("../controllers/product");
const middleware = require("../middleware/authenticateUser");

router.post("/creat-product",middleware.authenticateToken,productControllers.add_product);
router.put("edit-product",middleware.authenticateToken,productControllers.edit_product);

module.exports = router;