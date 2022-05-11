const adminModel = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.admin_signup = async (req,res) =>{
    try{
        let {firstName,lastName,email,type,phoneNumber,password,address} = req.body;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const userData = {firstName,lastName,email,type,phoneNumber,password,address};
        const dataCreated = await adminModel.create(userData);
        return res.status(201).send({message:"Admin created successfully",data:dataCreated});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.admin_login = async (req,res) =>{
    try{
        const adminEmail = req.body;
        const adminPassword = req.body;
        const adminData = await adminModel.findOne({email:adminEmail});
        if(user){
            const {_id,firstName,lastName,password} = user;
            const validPassword = await bcrypt.compare(adminPassword,password);
            if(!validPassword){
                return res.status(400).send({message:"Invalid Password"});
            };
            let payload = {userId:_id,email:adminEmail};
            const generatedToken = jwt.sign(payload,"sports-e-commerce",{expiresIn:'10080'});
            res.header("jwt-token",generatedToken);
            return res.status(201).send({message:`${firstName} ${lastName} You are logged in`,token:generatedToken});
        }else{
            return res.status(400).send({message:"Invalid credentials"});
        };
    }catch(err){
        return res.status(400).send(err.message);
    };
}

exports.admin_update = async (req,res) =>{
    try{
        const adminRequest = req.user;
        const adminData = await adminModel.findOne({_id:adminRequest.userId});
        let {firstName,lastName,type,phoneNumber,password,address} = req.body;
        if(password){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
        }
        if(address){
            if(address.street){
                adminData.address.street = address.street;
            };
            if(address.city){
                adminData.address.city = address.city;
            };
            if(address.pinCode){
                adminData.address.pinCode = address.pinCode;
            };
        }
        const newAdminData = await userModel.findOneAndUpdate({_id:adminData._id},{firstName:firstName,lastName:lastName,email:email,password:password,phoneNumber:phoneNumber,address:adminData.address});
        return res.status(201).send({message:"Admin data updated successfully",UpdatedData:newAdminData});
    }catch(err){
        return res.status(500).send(err.message);
    };
}