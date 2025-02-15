const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());
const {ProductModel}=require("../../../database/product.js");
const {verifyuser}=require("../../../middlewares/verifyuser.js");
const { UserModel } = require('../../../database/user.js');


mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

router.use(verifyuser);
router.post("/add",async (req,res)=>{
    const date = new Date().toISOString();
    const {category,name,amount}=req.body;
    try{
        await ProductModel.create({
            sellerId:req.userId,
            category,
            name,
            amount,
            date,
            status:"Live",
        });
        res.status(200).json({
            message:"Product successfully pubished for sale."
        });
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

router.patch("/update",async (req,res)=>{
    const {category,name,amount,date}=req.body;
    try{
        const profile=await UserModel.findByIdAndUpdate(req.userId,{
            category,
            name,
            amount,
        });
        if(!profile){
            return res.status(404).json({ message: "User not found"});
        }
        res.json({message:"Cart Updated Successfully"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.patch("/delete",async (req,res)=>{
    try{
        const profile=await UserModel.findByIdAndDelete(req.userId);
        if(!profile){
            return res.status(404).json({ message: "User not found"});
        }
        res.json({message:"Cart Deleted Successfully"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/cart",async (req,res)=>{
    try{
        const Data=await ProductModel.find({
            sellerId:req.userId,
        });
        if(!Data){
            return res.status(200).json({ message: "No items added yet."});
        }
        res.json(Data);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/cart/:saleid",async (req,res)=>{
    const saleId=req.params.saleid;
    try{
        const product=await ProductModel.findOne({
            _id:saleId,
            sellerId:req.userId,
        });
        if(!product){
            return res.status(404).json({ message: "No items are provided for sale."});
        }
        res.json({
            product,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
module.exports = router;