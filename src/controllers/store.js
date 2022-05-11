const subAdminModel = require("../model/storeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.subAdmin_signup = async (req,res) =>{
    try{

    }catch(err){
        return res.status(500).send(err.message);
    };
}