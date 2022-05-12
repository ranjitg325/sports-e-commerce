const subAdminModel = require("../model/storeModel");
const adminModel = require("../model/adminModel");
const storeModel = require("../model/storeModel");


exports.register_store = async (req,res) =>{
    try{
        const adminId = req.user.userId;
        const adminData = await adminModel.findOne({_id:adminId});
        if(!adminData){
            return res.status(400).send({setting:{success: "0",message:"You are not authorized"}});
        };
        const {storeName,storeSize,storeCapacity,address}= req.body;
        const storeRequest = {storeName,storeSize,storeCapacity,adminId,address};
        const storeData = await storeModel.create(storeRequest);
        await adminModel.findOneAndUpdate({_id:adminId},{$push:{allStoreId:storeData._id}},{new:true});
        return res.status(201).send({setting:{success:"1",message:"Store register successfully",StoreData:storeData}});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.get_store = async (req,res) =>{
    try{
         
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.edit_store = async (req,res) =>{
    try{
        const adminId = req.user.userId;
        const storeId = req.params.storeId;
        const adminData = await adminModel.findOne({_id:adminId});
        if(!adminData){
            return res.status(400).send({setting:{success:"0",message:"You are not authorized"}});
        };
        const {storeName,storeSize,storeCapacity}=req.body;
        const updatedStoreData = await storeModel.findOneAndUpdate({_id:storeId},{storeName:storeName,storeSize:storeSize,storeCapacity:storeCapacity});
        return res.status(201).send({setting:{success:"1",message:"Updated store data",newStoreData:updatedStoreData}});
    }catch(err){
        return res.status(500).send(err.message)
    }
}

exports.delete_store = async (req,res) =>{
    try{
        const adminId = req.user.userId;
        const storeId = req.params.storeId;
        const adminData = await adminModel.findOne({_id:adminId});
        if(!adminData){
            return res.status(400).send({setting:{success:"0",message:"You are not authorized"}});
        };
        await storeModel.findOneAndUpdate({_id:storeId},{isDeleted:true},{new:true});
        return res.status(200).send({setting:{success:"0",message:"Store Deleted successfully"}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}