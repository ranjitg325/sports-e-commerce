const subAdminModel = require("../model/subAdminModel");
const adminModel = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.subAdmin_signup = async (req,res) =>{
    try{
        const adminId = req.params.adminId;
        //const admin = await adminModel.findOne({_id:adminId});
        let {firstName,lastName,email,mobileNumber,password,address} = req.body;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const subAdminRequest = {firstName,lastName,email,mobileNumber,password,address};
        const subAdminData = await subAdminModel.create(subAdminRequest);
         await adminModel.findOneAndUpdate({_id:adminId},{$push:{allSubAdminId:subAdminData._id},new:true});
       
        return res.status(201).send({message:"Sub Admin created successfully",data:subAdminData});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.subAdmin_login = async (req,res) =>{
    try{
        const subAdminEmail = req.body.email;
        const subAdminPassword = req.body.password;
        let subAdmin = await subAdminModel.findOne({email:subAdminEmail});
        if(!subAdmin){
          return res.status(400).send({message:"email is not valid or user dose not exist"});
        };
        const {_id,firstName,lastName,password} = subAdmin;
        const validPassword = await bcrypt.compare(subAdminPassword,password);
        if(!validPassword){
            return res.status(400).send({message:"Invalid Password"});
        };
        const payload = { userId: _id, email: subAdminEmail };
        const generatedToken = jwt.sign(payload,"sports-e-commerce",{expiresIn:'10080'});
        res.header("jwt-token",generatedToken);
        return res.status(200).send({message:`&{firstName} &{lastName} you have logged in Successfully`})
    }catch(err){
        return res.status(500).send(err.message);
    }
};

exports.subAdmin_update = async (req,res) =>{
    try{
        const subAdminData = await subAdminModel.findOne({_id:adminRequest.req.user.userId});
        if(!subAdminData){
            return res.status(400).send({message:"You are not authorized"});
        };
        let {firstName,lastName,mobileNumber,password,address} = req.body;
        if(password){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
        }
        if(address){
            if(address.street){
                subAdminData.address.street = address.street;
            };
            if(address.city){
                subAdminData.address.city = address.city;
            };
            if(address.pinCode){
                subAdminData.address.pinCode = address.pinCode;
            };
        }
        const newSubAdminData = await userModel.findOneAndUpdate({_id:adminData._id},{firstName:firstName,lastName:lastName,email:email,password:password,mobileNumber:mobileNumber,address:subAdminData.address});
        return res.status(201).send({message:"Sub Admin data updated successfully",UpdatedData:newSubAdminData});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.delete_subAdmin = async (req,res) =>{
    try{
        const subAdminData = await subAdminModel.findOne({_id:adminRequest.req.user.userId});
        if(!subAdminData){
            return res.status(400).send({message:"You are not authorized"});
        };
        await subAdminModel.findOneAndUpdate({_id:req.user.userId},{isDeleted:true});
        return res.status(200).send({message:"sub admin deleted successfully"});
    }catch(err){
        return res.status(500).send(err.message);
    };
}