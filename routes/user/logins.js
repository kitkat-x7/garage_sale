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
const {email, password, details}=require("../../class/uservalidation.js");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");


// Is there a way to check if the req is valid or not
// Check if there is a way to encapsulate the fields of the request in a class.
// Not just for this route. For every route that makes an update/create.
router.post("/signup",async (req,res)=>{
    const useremail = new email(req);
    const userpassword = new password(req);
    const userdetails = new details(req);
    const emailverify=useremail.check_email();
    const passwordverify=userpassword.check_password();
    const detailsverify=userdetails.check_details(); 
    if(!emailverify.valid){
        return res.status(emailverify.status).json({ error: emailverify.message});
    }
    if(!passwordverify.valid){
        return res.status(passwordverify.status).json({ error: passwordverify.message});
    }
    if(!detailsverify.valid){
        return res.status(detailsverify.status).json({ error: detailsverify.message});
    }
    // if(!email.valid){
    //     return res.status(400).json({ error: "All fields are required" });
    // }
    //Todo left
    // const {firstname,lastname,address,phone_number}=req.body;
    // if (!email || !password || !firstname || !lastname || !address || !phone_number) {
    //     return res.status(400).json({ error: "All fields are required" });
    // }
    try{
        console.log(useremail.email);
        const existing=await UserModel.findOne({
            email:useremail.email
        });
        if(existing){
            return res.status(400).json({ error: "User already exists"});
        }
        const hashpassword=await bcrypt.hash(userpassword.password,10);
        await UserModel.create({
            email:useremail.email,
            password:hashpassword,
            firstname:userdetails.firstname,
            lastname:userdetails.lastname,
            address:userdetails.address,
            phone_number:userdetails.phone_number,
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
    const useremail = new email(req);
    const userpassword = new password(req);
    const emailverify=useremail.check_email();
    const passwordverify=userpassword.check_password();
    if(!emailverify.valid){
        return res.status(emailverify.status).json({ error: emailverify.message});
    }
    if(!passwordverify.valid){
        return res.status(passwordverify.status).json({ error: passwordverify.message});
    }
    try{
        const user=await UserModel.findOne({
            email:useremail.email,
        });
        if(!user){
            return res.status(404).json({ message: "Email not found"});
        }
        const isvalid=await bcrypt.compare(userpassword.password,user.password);
        if(isvalid){
            const token=jwt.sign({
                id:user._id,
            },JWT_SECRET,{expiresIn:"300m"});
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

router.get("/signout",async (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User Logged Out!",
    });
});

module.exports = router;