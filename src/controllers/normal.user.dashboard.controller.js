import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/Products.models.js";
import { Wishlist } from "../models/Wishlist.models.js";
import { Cart } from "../models/Cart.models.js";
import mongoose from "mongoose";
const {ObjectId} = mongoose.Types;
// user account deletion
const userAccountDelete = asyncHandler(async (req, res) => {
  // get user password
  // verify user token
  // verify user info
  // verify user password
  // delete the user

  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  await User.findByIdAndDelete(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

// add product to wishlist
const addProductToWishList = asyncHandler(async (req, res) => {
  // get product details or product id
  // verify user token
  // find the user
  // find the product
  // find wishlist
  // if not find create new one
  // if find check the product already exist in the wishlist or not
  // if not found product to the wishlist then add the new product
  // add to the wishlist

  const productId = req.body;

  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await Product.findById({ productId });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, wishList: [productId] });
  } else {
    if (wishlist.wishList.includes(productId)) {
      throw new ApiError(400, "Product is already in the wishlist");
    }

    wishlist.wishList.push(productId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product added to the wishlist"));
});

// remove product from wishlist
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  console.log(productId);

  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  const userId = req.use?._id;

  const wishlist = await Wishlist.findById({ userId });

  if (!wishlist) {
    throw new ApiError(404, "wishlist not found");
  }

  if (!wishlist.wishList.includes(productId)) {
    throw new ApiError(400, "Product is not in the wishlist");
  }

  wishlist.wishList = wishlist.wishList.filter(
    (product) => product.toString() !== productId
  );
  await wishlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Product remove successfully"));
});

// view wishlist
const viewWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const wishlist = await Wishlist.findOne({ userId }).populate("wishlist");

  if (!wishlist) {
    throw new ApiError(404, "wishlist not found");
  }

  return res.status(200).json(new ApiResponse(200, wishlist, "Success"));
});

// add product to cart
const addProductToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "productId and quantity is required");
  }

  const userId = req.user?._id;


    //   validate productId
  if(!ObjectId.isValid(productId)){
    throw new ApiError(400, "Invalid product Id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product is not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [
        {
          productId,
          quantity: Number(quantity),
        },
      ],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: Number(quantity),
      });
    }
  }

  // save the updated cart
  await cart.save();

  // use aggregation pipeline to calculate total price
  const aggregatedCart = await Cart.aggregate([
    {
      $match: { userId: new ObjectId(userId) },
    },
    {
      $unwind: {
        path: "$items",
        includeArrayIndex: "itemIndex",
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
        totalItems:{
            $sum:"$items.quantity"
        },
        items: { $push: "$items" },
      },
    },
  ]);

  // update teh cart with the new total price
  const updatedCart = aggregatedCart[0];
  await Cart.findByIdAndUpdate(cart._id, {
    totalPrice: updatedCart.totalPrice,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart,
        "Product added to cart successfully with total price"
      )
    );
});

export {
  userAccountDelete,
  addProductToWishList,
  removeProductFromWishlist,
  viewWishlist,
  addProductToCart,
};
