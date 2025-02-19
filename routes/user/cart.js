const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
const {CartModel}=require("../../database/cart.js");
const {ProductModel}=require("../../database/product.js");
app.use(express.json());
app.use(cookieparser());
const {verifyuser}=require("../../middlewares/verifyuser.js");
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

router.use(verifyuser);
router.get("/",async (req,res)=>{
    try{
        const orders=await CartModel.find({
            buyerid:req.userId
        });
        if(!orders){
            return res.status(200).json({
                message:"No items added in the cart."
            });
        }
        let cart=[];
        let item;
        for(Id in orders){
            item=await ProductModel.findById(orders[Id]['itemid']);
            cart.push(item);
        }
        res.status(200).json(cart);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post("/:itemid",async (req,res)=>{
    const {itemid}=req.params.itemid;
    const {count}=req.body;
    try{
        const item=await ProductModel.findById(itemid);
        if(count>item.count){
            return res.status(404).json({
                message:`Above the stock limit.`
            });
        }
        if(item.status==="Sold"){
            return res.status(404).json({
                message:"Item is out of stock"
            });
        }
        await CartModel.create({
            buyerid:req.userId,
            itemid,
            count,
        });
        res.status(200).json({message:"User Sign Up Successfull."});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: err.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});

router.patch("/:itemid",async (req,res)=>{
    const {itemid}=req.params.itemid;
    const {count}=req.body;
    try{
        await CartModel.updateOne(itemid,{
            count
        });
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})
router.delete("/:itemid",async (req,res)=>{
    const itemid=req.params.itemid;
    try{
        const item=await CartModel.findOneAndDelete({
            itemid,
        });
        if(!item){
            return res.status(404).json({ message: "User not found" });
        }
        res.json({message:"Item deleted successfully"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: err.message });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;