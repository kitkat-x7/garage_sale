const express=require('express');
const app=express();
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const {JWT_SECRET}=require("../config/config");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

function verifyuser(req,res,next){
    const token=req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found! Please log in." });
    }
    try{
        const decodedtoken=jwt.verify(token,JWT_SECRET);
        req.userId=decodedtoken.id;
        next();
    }catch(err){
        console.error(err);
        if (err.name === "JsonWebTokenError") {
            // Redirect to "/signin"
            res.status(401).json({ message: "Invalid Token! Please log in." });
        } else if (err.name === "TokenExpiredError") {
            // Redirect to "/signin"
            res.status(401).json({ message: "Token Expired! Please login again." });
        } else {
            res.status(500).json({ message: "Server Error" });
        }
    }
}

module.exports={
    verifyuser,
}