const orderModel = require("../model/order");
const cartModel = require("../model/cart");

exports.make_order = async (req,res)=>{
    try{
        const cartId = req.body.cartId;
        const cartData = await cartModel.findOne({_id:cartId});
        if(!cartData) return res.status(400).send({setting:{success:"0",message:"This cart dose not exist"}});
        const cartCheck = cartData.items.length;
        if(cartCheck==0) return res.status(404).send({setting:{success:"0",message:"no product exist add product to make order"}});
        const {userId,items,totalPrice,totalItems} = cartData;
        let totalQuantity = 0;
        const totalItem = items.length;
        for(let i=0;i<totalItem;i++)
          totalQuantity = totalQuantity+Number(items[i].quantity);
        const orderRequest = {userId,items,totalPrice,totalItems,totalQuantity};
        const orderData = await orderModel.create(orderRequest);
        return res.status(201).send({setting:{success:"1",message:"order placed successfully",OrderDetail:orderData}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}

exports.cancel_order = async (req,res)=>{
    try{
        const productId = req.body.orderId;
        const cancelledOrder = await orderModel.updateOne({_id:productId},{isDeleted:true,deletedAt:Date(),status:"canceled"},{new:true});
        return res.status(200).send({setting:{success:"1",message:"order has been cancelled successfully",Cancelled_Order:cancelledOrder}});
    }catch(err){
        return res.status(500).send(err.message);
    };
}