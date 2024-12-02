import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
const {ObjectId} = mongoose.Types;


// order place
const orderPlace = asyncHandler(async(req, res) => {
    // validating the incoming order data (ensuring the products exist and are in stock)
    // creating a new order
    // calculating the total price of the order
    // updating the product stock
    // handling errors (insufficient stock, inavlid products)
    // response send

    
});

