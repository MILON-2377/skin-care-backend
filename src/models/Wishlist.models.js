import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true,
    },
    wishList:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                index:true,
            }
        ],
    }
});


export const Wishlist = mongoose.model("Wishlist", wishlistSchema);