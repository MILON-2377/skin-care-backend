import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true,
    },
    stockLevel:{
        type: Number,
        required: true,
        min:0,
    },
    lastRestocked: {
        type: Date,
        default: Date.now,
    },
    stockAlertLevel:{
        type: Number,
        default:10
    }
},
{
    timestamps: true
});

export const Inventory = mongoose.model("Inventory", inventorySchema);