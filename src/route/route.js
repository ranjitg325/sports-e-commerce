const express = require('express');
const router = express.Router();


const userController = require("../controllers/user");
const adminController = require("../controllers/admin");
const subAdminController = require("../controllers/subAdmin");
const middleware = require("../middleware/authenticateUser");

router.post('/user/signup',userController.user_signup);
router.post('/user/login',userController.login);
router.put('/user/update',middleware.authenticateToken,userController.userUpdate)
router.post('/admin/signup',adminController.admin_signup);
router.post('/admin/login',adminController.admin_login);
router.put('/admin/update',middleware.authenticateToken,adminController.admin_update);
router.post('/subAdminSignup/:adminId',subAdminController.subAdmin_signup);
router.post('/subAdmin/login',subAdminController.subAdmin_login);
router.put('/subAdmin/update',middleware.authenticateToken,subAdminController.subAdmin_update);
router.put('/subAdmin/delete/account',middleware.authenticateToken,subAdminController.subAdmin_login);


module.exports=router;