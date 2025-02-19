const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Product= new Schema({
    //usage of Zod
    sellerId:{
        type:ObjectId,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{ 
        type: Date,
        required:true,
        default: Date.now
    },
    status:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        default:0
    }
});

const ProductModel = mongoose.model("Product", Product);

module.exports={
    ProductModel,
}