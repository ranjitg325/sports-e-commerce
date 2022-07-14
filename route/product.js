const express = require('express');
const router = express.Router();


const productControllers = require("../controllers/product");
const middleware = require("../middleware/authenticateUser");

router.post("/add_product",middleware.authenticateToken,productControllers.add_product);
router.put("/edit_product",middleware.authenticateToken,productControllers.edit_product);
router.get("/get_products",productControllers.get_products);
router.put("/delete_product",middleware.authenticateToken,productControllers.delete_product);
router.get("/product",productControllers.get_specific_product);
router.post("/wishlist",middleware.authenticateToken,productControllers.add_to_wishlist);
router.post("/remove_wishlist",middleware.authenticateToken,productControllers.remove_from_wishlist);

module.exports = router;