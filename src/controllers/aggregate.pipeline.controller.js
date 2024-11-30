import { Cart } from "../models/Cart.models.js";
import mongoose from "mongoose";
const {ObjectId} = mongoose.Types;

const countTotalPriceAndItems = async (userId) => {

  const aggregatedCart = await Cart.aggregate([
    {
      $match: { userId: new ObjectId(userId) },
    },
    {
      $unwind: {
        path: "$items",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: {
        path: "$productDetails",
        includeArrayIndex: "itemIndex",
      },
    },
    {
      $group: {
        _id: "$_id",
        totalPrice: {
          $sum: { $multiply: ["$items.quantity", "$productDetails.price"] },
        },
        totalItems: {
          $sum: "$items.quantity",
        },
        items: { $push: "$items" },
      },
    },
  ]);

  return aggregatedCart[0];
};


export {
    countTotalPriceAndItems,
};