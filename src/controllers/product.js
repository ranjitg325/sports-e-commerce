const adminModel = require("../model/adminModel");
const brandModel = require("../model/brandModel");
const productModel  = require("../model/productModel");


exports.add_brands = async (req,res) =>{
    try{
        const adminId = req.user.userId;
        const adminData = await adminModel.findOne({_id:adminId});
        if(!adminData){
            return res.status(400).send({setting:{success:"0",message:"You are not authorized"}});
        };
        const {brandName,productName,title,description,subcategory,price,currencyId,currencyFormat,style,productType,installments} = req.body;
        const brandExist = await brandModel.findOne({brandName:brandName});
        if(!brandExist){
            return res.status(400).send({setting:{success:"0",message:"brand name is not valid or dose not exist"}});
        };
        const productRequest = {brandName,productName,title,description,subcategory,price,currencyId,currencyFormat,style,productType,installments};
        const productData = await productModel.create(productRequest);
        return res.status(201).send({setting:{success:"1",message:"product created successfully",ProductData:productData}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.edit_brand = async (req,res)=>{
    try{
        const adminId = req.user.userId;
        const adminData = await adminModel.findOne({_id:adminId});
        const subAdminData = await adminModel.findOne({_id:adminId});
        if(!adminData || !subAdminData){
            return res.status(400).send({setting:{success:"0",message:"You are not authorized"}});
        };
        
    }catch(err){
        return res.status(500).send(err.message);
    };
}