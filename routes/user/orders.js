const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());
const {orderhistoryModel}=require("../../database/orders_history");
const {ProductModel}=require("../../database/product.js");
const {verifyuser}=require("../../middlewares/verifyuser.js");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");
router.use(verifyuser);

// TODO: RIBHAV TO REVIEW

router.get("/",async (req,res)=>{
    try{
        const orderdata=await orderhistoryModel.find({
            buyerid:req.userId,
        });
        if(!orderdata){
            return res.status(200).json({
                message:"No orders yet!!!!!!"
            });
        }
        let order=[];
        let item;
        for(Id in orderdata){
            item=await ProductModel.findById(orderdata[Id]['itemid']);
            order.push(item);
        }
        res.status(200).json(order);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({message: "Internal Server Error"});
    }
});


router.get("/:orderId",async (req,res)=>{
    const orderId=req.params.orderId;
    try{
        const product=await ProductModel.findOne({
            _id:orderId,
        });
        if(!product){
            return res.status(404).json({ message: "Item not found!"});
        }
        res.status(200).json({
            product,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;