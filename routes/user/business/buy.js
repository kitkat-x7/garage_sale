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
const {CartModel}=require("../../../database/cart.js");
const {verifyuser}=require("../../../middlewares/verifyuser.js");


mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/store");

router.use(verifyuser);

router.get("/",async (req,res)=>{
    try{
        const purchase=await CartModel.find({
            buyerid:req.userId,
        });
        if(purchase.length===0){
            return res.status(200).json({
                message:"No items in the cart"
            });
        }
        let item,c;
        const status="Sold"
        for(Id in purchase){
            item=await ProductModel.findOne({_id:purchase[Id]['itemid']});
            c=item.count-purchase[Id]['count'];
            await ProductModel.updateOne({_id:purchase[Id]['itemid']},{
                status,
                count:c,
            });
        }
        await CartModel.deleteMany({
            buyerid:req.userId,
        });
        res.status(200).json({ message: "Purchase successful!" });
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

module.exports = router;