const express = require('express');
const router = express.Router();


const subAdminController = require("../controllers/subAdmin");
const middleware = require("../middleware/authenticateUser");

router.post('/signup/:adminId',subAdminController.subAdmin_signup);
router.post('/login',subAdminController.subAdmin_login);
router.put('/update',middleware.authenticateToken,subAdminController.subAdmin_update);
router.put('/delete/account',middleware.authenticateToken,subAdminController.subAdmin_login);

module.exports=router;