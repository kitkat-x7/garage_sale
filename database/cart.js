const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Cart= new Schema({
    //usage of Zod
    buyerid:{
        type:ObjectId,
        required:true
    },
    itemid:{type:ObjectId, required:true},
});

const CartModel = mongoose.model("Cart", Cart);

module.exports={
    CartModel,
}