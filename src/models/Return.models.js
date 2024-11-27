import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
    orderId:{
        type: mongoose.Schema.Types.orderId,
        ref:"Order",
        required: true,
    },
    reason:{
        type: String,
        required: true,
        enum:["damaged","wrong_item","size_issue", "other"]
    },
    status:{
        type : String,
        enum:["pending", "approved", "rejected", "refunded"],
        default: "pending",
    },
    returnDate:{
        type: Number,
        min:0,
        default: 0,
    },
    comments:{
        type: String,
        default: "",
    }
},{timestamps:true});

export const Return = mongoose.model("Return", returnSchema);