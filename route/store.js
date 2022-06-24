const express = require('express');
const router = express.Router();


const storeController = require("../controllers/store");
const middleware = require("../middleware/authenticateUser");

router.post("/register",middleware.authenticateToken,storeController.register_store);
router.put("/edit",middleware.authenticateToken,storeController.edit_store);
router.put("/delete",middleware.authenticateToken,storeController.delete_store);
router.put("/add_user/:storeId",middleware.authenticateToken,storeController.add_user_to_store);
router.delete("/remove-access-to",middleware.authenticateToken,storeController.remove_access);


module.exports=router;