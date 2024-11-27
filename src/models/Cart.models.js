import mongoose from "mongoose";


const itemsSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true,
        index: true,
    },
    quantity:{
        type: Number,
        required: true,
        index: true,
    }
});

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true,
    },
    items:{
        type: [itemsSchema],
        required: true,
        default:[],
    },
    totalItems:{
        type: Number,
        required: true,
        default:0,
    },
    totalPrice:{
        type: Number,
        required: true,
    },

},{timestamps: true});


export const Cart = mongoose.model("Cart", cartSchema);