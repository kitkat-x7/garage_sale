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
const {JWT_SECRET}=require("../../config/config.js");
const {verifyuser}=require("../../middlewares/verifyuser.js");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

router.post("/signup",async (req,res)=>{
    const {email,password,firstname,lastname,address,phone_number}=req.body;
    if (!email || !password || !firstname || !lastname || !address || !phone_number) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try{
        const existing=await UserModel.findOne({
            email,
        });
        if(existing){
            return res.status(400).json({ error: "User already exists"});
        }
        const hashpassword=await bcrypt.hash(password,10);
        await UserModel.create({
            email,
            password:hashpassword,
            firstname,
            lastname,
            address,
            phone_number,
        });
        return res.json({message:"User Sign Up Successfull."});
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

router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({
            email,
        });
        if(!user){
            return res.status(404).json({ message: "Email not found"});
        }
        const isvalid=await bcrypt.compare(password,user.password);
        if(isvalid){
            const token=jwt.sign({
                id:user._id,
            },JWT_SECRET,{expiresIn:"30m"});
            const time = 300*60*1000;
            res.cookie("token", token, {
                maxAge: time,
            });
            res.status(200).json({
                message:"User Signed In!",
            });
        }else{
            return res.status(403).json({ message: "Forbidden! Wrong Password!" });
        }
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.use(verifyuser);

router.get("/signout",async (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User Logged Out!",
    });
});

module.exports = router;