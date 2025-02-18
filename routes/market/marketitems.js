const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());
const {CategoryModel}=require("../../database/category.js");
const { ProductModel } = require('../../database/product.js');

mongoose.connect("");
// Categories --> "/categories"
router.get("/categories",async (req,res)=>{
    try{
        const list=await CategoryModel.find();
        if(!list){
            return res.status(200).json({ message: "No products added"});
        }
        res.status(200).json(list);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
// Category --> "/category/:id/items"
router.get("/categories/:category",async (req,res)=>{
    const category=req.params.category;
    try{
        const list=await ProductModel.find({
            category,
        });
        if(!list){
            return res.status(404).json({ message: "No products found"});
        }
        res.status(200).json(list);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// Item --> "/items/:id"
router.get("/:itemid",async (req,res)=>{
    const itemid=req.params.itemid;
    try{
        const data=await ProductModel.findById(itemid);
        if(!data){
            return res.status(404).json({ message: "No such product found"});
        }
        res.status(200).json(data);
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// Items --> "/items"
//Access products without categories also
