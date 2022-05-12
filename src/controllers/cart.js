const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const userModel = require("../model/userModel");


exports.add_cart = async (req,res) =>{
    try{
        const userId = req.user.userId
        const userData = await userModel.findOne({_id:userId});
        if(!userData){
            return res.status(400).send({setting:{success:"0",message:"You are not login"}});
        };
        let isDBexists = await cartModel.findOne({ userId: userId });
        if (!isDBexists) {
            let cart = req.body
            let totalPrice = 0
            let totalItems = cart.items.length;
            let totalQuantity = cart.items[0].quantity 
            if (totalQuantity < 1) { 
                return res.status(400).send({ status: false, msg: "There is nothing to add in your cart as your total quantity is zero" });
            }
            if (totalItems > 1) {
                return res.status(400).send({ status: false, msg: "please add one item at a time" });
            }
            let demo = await productModel.findOne({ _id: (cart.items[0].productId), isDeleted: false })
            if (!demo) { 
                return res.status(400).send({ status: false, message: "(1). This product is no longer exist" })
            }
            totalPrice = (demo.price) * cart.items[0].quantity
            cart.userId = paramsId
            cart.totalItems = totalItems
            cart.totalPrice = totalPrice
            const cartCreate = await cartModel.create(cart);
            return res.status(201).send({ status: true, message: 'Success', data: cartCreate });
        }
        else {
            let cart = req.body
            let totalItems = cart.items.length;
            let totalQuantity = cart.items[0].quantity 
            if (totalQuantity < 1) { 
                return res.status(400).send({ status: false, msg: "There is nothing to add in your cart as your total quantity is zero" });
            }
            if (totalItems > 1) {
                return res.status(400).send({ status: false, msg: "please add one item at a time" });
            }
            let body = {}
            body.val = 0
            let len = isDBexists.items.length;
            for (let i = 0; i < len; i++) {
                if (cart.items[0].productId == isDBexists.items[i].productId) {
                    let product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                    if (!product) { 
                        return res.status(400).send({ status: false, message: "(2). This product is no longer exist" })
                    }
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) + Number(product.price) * Number(cart.items[0].quantity)
                    isDBexists.items[i].quantity = Number(isDBexists.items[i].quantity) + Number(cart.items[0].quantity)
                    body.val = 1;
                    isDBexists.save();
                }
            }
            if (body.val == 0) {
                let product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                if (!product) {
                    return res.status(400).send({ status: false, message: "(3). This product is no longer exist" })
                }
                isDBexists.items.push(cart.items[0]); 
                isDBexists.totalItems += 1 
                isDBexists.totalPrice = isDBexists.totalPrice + Number(cart.items[0].quantity) * product.price;
                isDBexists.save();
            }
            return res.status(200).send({ status: true, msg: "successFul", data: isDBexists })
        }
    
    }catch(err){
        return res.status(500).send(err.message);
    };
} 

