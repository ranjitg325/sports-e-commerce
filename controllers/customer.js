const customerModel = require("../model/customer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require('../utils/sendMail');
const otpGenerator = require('otp-generator');

exports.user_signup = async (req,res)=>{
    try{
        let{firstName,lastName,gender,dateOfBirth,battingSide,email,phone,password,address}=req.body;
        const dataExist = await customerModel.findOne({email:email});
        if(dataExist) return res.status(400).send({message:"email already in use"});
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const userRequest = {firstName,lastName,gender,dateOfBirth,battingSide,email,phone,password,address};
        const userData = await customerModel.create(userRequest);
        return res.status(201).send({message:"User signup successfully",data:userData});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.send_otp_toEmail = async (req,res) => {
    try{
        // const mobile = req.body.mobile;
        // const userData = await customerModel.findOne({mobile:mobile});
        // if(!userData){
        //     return res.status(400).send({setting:{success:"0",message:"not valid user"}});
        // };
        // const otp = Math.floor(Math.random()*9000)+1000;
        // const message = `Your OTP is ${otp}`;
        // // const springedgeClient = new springedge.Client({
        // //     apiKey: 'b9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8',
        // //     apiSecret: 'f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8',
        // //     baseUrl: 'https://api.springedge.com/v1/'
        // // });
        // const parames = {
        //     "apiKey": 'b9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8',
        //     "sender":"Balaji",
        //     "to":[
        //         mobile
        //     ],
        //     "message":message
        // };
        // springedge.messages.send(parames,function(err,data){
        //     if(err) return res.status(500).send(err);
        //     return res.status(200).send({setting:{success:"1",message:"otp sent successfully"}});
        // }
        // );
        const userMail = req.body.email;    
        const userData = await customerModel.findOne({email:userMail});
        if(!userData){
            return res.status(400).send({setting:{success:"0",message:"not valid user"}});
        }
        let mail_otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
          });
        
          console.log(process.env.AUTH_EMAIL,process.env.AUTH_PASS);
         await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: userMail,   
            subject: 'OTP',
            text: `Your OTP is ${mail_otp} to login into your account`
        });

        const salt = await bcrypt.genSalt(10);
        mail_otp = await bcrypt.hash(mail_otp,salt);

        await customerModel.updateOne({email:userMail},{$set:{mail_otp:mail_otp}});

        return res.status(200).send({setting:{success:"1",message:"otp sent successfully"}});
        
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.login = async (req,res) =>{
    try{
        const userEmail = req.body.email;
        const userOtp = req.body.otp;
        const dataExist = await customerModel.findOne({email:userEmail});
        if(!emailExist) return res.status(404).send({message:"user dose not exist"});
        const {_id,firstName,lastName,}=dataExist;
        const validOtp = await bcrypt.compare(userOtp,);
        if(!validOtp) return res.status(400).send({message:"Invalid Password"});
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
        let userData = await customerModel.findOne({_id:userRequest.userId});
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
        const updatedData = await customerModel.findOneAndUpdate({_id:_id},{firstName:firstName,lastName:lastName,gender:gender,dateOfBirth:dateOfBirth,battingSide:battingSide,email:email,phone:phone,password:password,address:userData.address});
        return res.status(201).send({message:"user profile update successfully",data:updatedData});
    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.forgot_password = async (req,res) =>{
    try{
         const email = req.body.email;
         const userData = await customerModel.findOne({email:email});
         if(!userData){
             return res.status(400).send({setting:{success:"0",message:"not valid user"}});
         };

    }catch(err){
        return res.status(500).send(err.message);
    }
}

exports.setNew_password = async (req,res) => {
   try{
       const newPassword = req.body.password;
       
   }catch(err){
       return res.status(500).send(err.message);
   }
}