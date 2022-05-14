const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");
const userModel = require("../model/userModel");


exports.add_cart = async (req,res) =>{
    try{
        const userId = req.user.userId
       
        const isCartExeste = await cartModel.findOne({ userId: userId });
        if (!isCartExeste) {
            const cart = req.body
            const totalPrice = 0
            const totalItems = cart.items.length;
            const totalQuantity = cart.items[0].quantity 
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
            const cart = req.body
            const totalItems = cart.items.length;
            const totalQuantity = cart.items[0].quantity 
            if (totalQuantity < 1) { 
                return res.status(400).send({ status: false, msg: "There is nothing to add in your cart as your total quantity is zero" });
            }
            if (totalItems > 1) {
                return res.status(400).send({ status: false, msg: "please add one item at a time" });
            }
            let body = {}
            body.val = 0
            let len = isCartExeste.items.length;
            for (let i = 0; i < len; i++) {
                if (cart.items[0].productId == isCartExeste.items[i].productId) {
                    let product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                    if (!product) { 
                        return res.status(400).send({ status: false, message: "(2). This product is no longer exist" })
                    }
                    isCartExeste.totalPrice = Number(isCartExeste.totalPrice) + Number(product.price) * Number(cart.items[0].quantity)
                    isCartExeste.items[i].quantity = Number(isCartExeste.items[i].quantity) + Number(cart.items[0].quantity)
                    body.val = 1;
                    isCartExeste.save();
                }
            }
            if (body.val == 0) {
                const product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                if (!product) {
                    return res.status(400).send({setting:{ success:"0", message: "(3). This product is no longer exist" }})
                }
                isCartExeste.items.push(cart.items[0]); 
                isCartExeste.totalItems += 1 
                isCartExeste.totalPrice = isCartExeste.totalPrice + Number(cart.items[0].quantity) * product.price;
                isCartExeste.save();
            }
            return res.status(200).send({setting:{ success:"1", msg: "successFul", data: isCartExeste }})
        }
    
    }catch(err){
        return res.status(500).send(err.message);
    };
} 

exports.edit_cart = async (req,res) =>{
    try{
        let { cartId, productId, removeProduct } = req.body;
        let checkId1 = ObjectId.isValid(cartId);
        if (!checkId1) { 
            return res.status(400).send({setting:{ success:"0", message: "Please Provide a valid cartId" }});;
        }
        let checkId2 = ObjectId.isValid(productId);
        if (!checkId2) { 
            return res.status(400).send({setting:{ success:"0", message: "Please Provide a valid productId" }});;
        }
        let isDBexists = await cartModel.findOne({ _id: cartId });
        if (!isDBexists) {
            return res.status(400).send({setting:{ success:"0", message: "This cart id doesn't exist" }})
        }
        if (!(req.userId == isDBexists.userId)) { 
            return res.status(400).send({setting:{ success:"0", message: "This cart is not yours" }})
        }
        let len = isDBexists.items.length;
        for (let i = 0; i < len; i++) {  // we are checking that the product that we are sending from request body is exist in our items of cart model 
            if (productId == isDBexists.items[i].productId) {    // the client is suggesting us for decrementation of one quantity of the product from the cart
                if (removeProduct == 1) {
                    let product = await productModel.findOne({ _id: productId, isDeleted: false }); // => isdeleted added
                    if (!product) return res.status(400).send({setting:{ success:"0", message: " This product is no longer exist" }})
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(product.price)
                    isDBexists.items[i].quantity -= 1
                    if (isDBexists.items[i].quantity == 0) {
                        isDBexists.items.splice(i, 1)
                        isDBexists.totalItems -= 1
                    };
                    isDBexists.save();
                    break;
                } else { // the client is suggesting us to remove that particular product from the cart
                    let product = await productModel.findOne({ _id: productId, isDeleted: false });
                    if (!product) return res.status(400).send({setting:{ success:"0", message: "This product is no longer exist" }});
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(isDBexists.items[i].quantity) * Number(product.price)
                    isDBexists.items.splice(i, 1)
                    isDBexists.totalItems -= 1
                    isDBexists.save();
                    if (isDBexists.items.length == 0) {
                        isDBexists.totalPrice = 0
                        isDBexists.save();
                    }; break;
                }
            }
        }
        return res.status(200).send({ status: true, message: "cart edited successfully", data: isDBexists });
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.get_cart = async (req,res)=>{
    try{
        const userId = req.user.uerId;
        const cartData = await cartModel.findOne({userId:userId});
        const cartChecked = cartData.items.length;
        if(cartChecked==0){
            return res.status(404).send({setting:{success:"0",message:"The cart is emptor deleted"}});
        }else{
            return res.status(200).send({setting:{success:"1",message:"cart fetch successfully",cart:cartData}});
        }
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.delete_cart = async (req,res)=>{
    try{
        const userId = req.user.userId;
        
        const cartData = await cartModel.findOneAndUpdate({userId:userId},{items:[],totalPrice:0,totalItems:0},{new:true});
        return res.status(204).send({setting:{success:"1",message:"cart deleted successfully",Cart:cartData}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}