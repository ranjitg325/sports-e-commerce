const express = require('express');
const router = express.Router();


const userController = require("../controllers/customer");
const middleware = require("../middleware/authenticateUser");

router.post('/signup',userController.user_signup);
router.post('/login',userController.login);
router.put('/update',middleware.authenticateToken,userController.userUpdate);
router.post('/email_otp',userController.send_otp_toEmail);

module.exports=router;