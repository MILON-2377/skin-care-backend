import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orders : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders",
        }
    ],
});

export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);