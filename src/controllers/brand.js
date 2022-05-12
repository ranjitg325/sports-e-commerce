const adminModel = require("../model/adminModel");
const brandModel = require("../model/brandModel");


exports.add_brand = async (req,res) =>{
    try{
        const adminId = req.user.userId;
        const adminData = await adminModel.findOne({_id:adminId});
        
        if(!adminData){
            return res.status(400).send({setting:{success:"0",message:"You are not authorized"}});
        };
        const {brandName,brandType,storeId} = req.body;
        const brandRequest = {brandName,brandType,storeId,adminId};
        const brandData = await brandModel.create(brandRequest);
        return res.status(201).send({setting:{success:"1",message:"brand created successfully",BrandData:brandData}});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.get_all_brands = async (req,res) =>{
    try{
        const brands = await brandModel.find();
        return res.status(200).send({setting:{success:"1",allBrands:brands}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.getBrands_by_query = async (req,res) =>{
    try{
        const filter = {
            isDeleted:false
        }
        if(req.query.brandName){
            filter["brandName"] = req.query.brandName;
        };
        if(req.query.brandType){
            filter["brandType"] = req.query.brandType;
        };
        const brands  = await brandModel.find(filter);
        return res.status(200).send({setting:{success:"1",message:"All Brands",allBrands:brands}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}