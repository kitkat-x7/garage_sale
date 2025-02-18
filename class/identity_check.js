const express=require('express');
const app = express();
app.use(express.json());
const mongoose=require('mongoose');
const {ProductModel}=require("../database/product");
const { orderhistoryModel } = require('../database/orders_history');
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

class identify_seller{
    constructor(seller_id,product_id){
        this.id=seller_id;
        this.product=product_id;
    }
    async check(){
        const product=await ProductModel.findById(this.product);
        if(!product){
            return {
                "valid":false,
                "status":404,
                "message":"Product not found",
            };
        }if(product.sellerId!=this.id){
            return {
                "valid":false,
                "status":401,
                "message":"Unauthorised Access.",
            };
        }return {
            valid:true,
            status:200,
            "message":"OK"
        }
    }
}

class identify_buyer{
    constructor(buyer_id,order_id){
        this.id=buyer_id;
        this.order=order_id;
    }
    async check(){
        const order=await orderhistoryModel.findOne({itemid:this.order});
        if(!order){
            return {
                "valid":false,
                "status":404,
                "message":"Order not found",
            };
        }if(order.buyerid!=this.id){
            return {
                "valid":false,
                "status":401,
                "message":"Unauthorised Access.",
            };
        }return {
            valid:true,
            status:200,
            "message":"OK"
        }
    }
}

module.exports={
    identify_seller,
    identify_buyer,
}