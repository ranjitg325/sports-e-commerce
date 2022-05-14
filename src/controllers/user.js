const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.user_signup = async (req,res)=>{
    try{
        let{firstName,lastName,gender,dateOfBirth,battingSide,email,phone,password,address}=req.body;
        const dataExist = await userModel.findOne({email:email});
        if(dataExist) return res.status(400).send({message:"email already in use"});
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const userRequest = {firstName,lastName,gender,dateOfBirth,battingSide,email,phone,password,address};
        const userData = await userModel.create(userRequest);
        return res.status(201).send({message:"User signup successfully",data:userData});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.login = async (req,res) =>{
    try{
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const dataExist = await userModel.findOne({email:userEmail});
        if(!emailExist) return res.status(404).send({message:"user dose not exist"});
        const {_id,firstName,lastName,password}=dataExist;
        const validPassword = await bcrypt.compare(userPassword,password);
        if(!validPassword) return res.status(400).send({message:"Invalid Password"});
        const payload = { userId:_id,email:userEmail};
        const generatedToken = jwt.sign(payload,"sports-e-commerce",{expiresIn:'10080m'});
        res.header('jwt-token',generatedToken);
        return res.status(200).send({message:`${firstName} ${lastName} you are logged in Successfully`,Token:generatedToken});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.userUpdate = async (req,res) =>{
    try{
        const userRequest = req.user;
        let userData = await userModel.findOne({_id:userRequest.userId});
        const requestBody = req.body;
        let { firstName,lastName,gender,dateOfBirth,battingSide,email,phone,password,address} = req.body;
        if(password){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
        }
        if(address){
            if(address.shipping){
                if(address.shipping.street){
                    userData.address.shipping.street = address.shipping.street;
                };
                if(address.shipping.city){
                    userData.address.shipping.city = address.shipping.street;
                };
                if(address.shipping.pinCode){
                    userData.address.shipping.pinCode = address.billing.pinCode;
                };
            }
            if(address.billing){
                if(address.billing.street){
                    userData.address.billing.street = address.billing.street;
                };
                if(address.billing.street){
                    userData.address.billing.city = address.billing.city;
                };
                if(address.billing.street){
                    userData.address.billing.pinCode = address.billing.pinCode;
                };
            }
        }
        const updatedData = await userModel.findOneAndUpdate({_id:_id},{firstName:firstName,lastName:lastName,gender:gender,dateOfBirth:dateOfBirth,battingSide:battingSide,email:email,phone:phone,password:password,address:userData.address});
        return res.status(201).send({message:"user profile update successfully",data:updatedData});
    }catch(err){
        return res.status(500).send(err.message);
    }
}