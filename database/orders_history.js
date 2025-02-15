const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Order= new Schema({
    //usage of Zod
    buyerid:{
        type:ObjectId,
        required:true
    },
    sellerid:{
        type:ObjectId,
        required:true
    },
    itemid:{type:ObjectId, required:true},
    date_purchase:{ 
        type: Date,
        required:true
    },
});

const orderhistoryModel = mongoose.model("OrderHistory", Order);

module.exports={
    orderhistoryModel,
}