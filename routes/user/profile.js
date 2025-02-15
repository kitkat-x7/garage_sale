const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());
const {UserModel}=require("../../database/user.js");
const {verifyuser}=require("../../middlewares/verifyuser.js");


mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

router.use(verifyuser);

router.get("/",async (req,res)=>{
    try{
        const profile=await UserModel.findById(req.userId);
        if(!profile){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
            address: profile.address,
            phone_number: profile.phone_number 
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


router.patch("/update",async (req,res)=>{
    const {email,firstname,lastname,address,phone_number}=req.body;
    try{
        const status=await UserModel.findByIdAndUpdate(req.userId,{
            email,
            firstname,
            lastname,
            address,
            phone_number,
        });
        if(!status){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message:"Profile Updated Successfully!!!!!!"
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.put("/forget-password",async (req,res)=>{
    //Will not use the email auth now
    const {password}=req.body;
    try{
        const profile=await UserModel.findById(req.userId);
        if(!profile){
            return res.status(404).json({ message: "User not found" });
        }
        const isPassword=await bcrypt.compare(password,profile.password);
        if(!isPassword){
            return res.status(400).json({ message: "New password must be different from the old password."});
        }
        const updatedpassword=await bcrypt.hash(password, 10);
        await UserModel.findByIdAndUpdate(req.userId,{
            password:updatedpassword,
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: err.message });
        }if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})
    

router.delete("/delete",async (req,res)=>{
    try{
        const profile=await UserModel.findByIdAndDelete(req.userId);
        if(!profile){
            return res.status(404).json({ message: "User not found" });
        }
        res.json({message:"Deleted Successfully"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;