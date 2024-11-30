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
  const items = req.body || [];

  // validation check
  if(items.length === 0){
    throw new ApiError(400, "At least one product details is required");
  }

  for(let item of items){
    if(!item.productId){
      throw new ApiError(400, "productId is required");
    }

    if(item.quantity === 0){
      throw new ApiError(400, "At least one quantity is required");
    }

    if(item.quantity < 0){
      throw new ApiError(400, "quantity can not be negative ");
    }
  }

  // get the user id
  const userId = req.user?._id;

  const productIds = items.map(i => i.productId );

  
  const products = await Product.find({_id: {$in: productIds}});

  if(products.length === 0){
    throw new ApiError(404, "No products found for the given productIds");
  }


  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [...items],
      totalItems: Number(items.length),
    });
  } else{

    for(let item of items){
      const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === item.productId.toString());

      if(existingItemIndex !== 1){
        cart.items[existingItemIndex].quantity += item.quantity;
      }else{
        cart.items.push(item);
      }
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

  if(aggregatedCart.length > 0){
    const updatedCart = aggregatedCart[0];

    cart.totalPrice = updatedCart.totalPrice;
    cart.totalItems = updatedCart.totalItems;

    await cart.save();
  }else{
    throw new ApiError(404, "Failed to aggregate cart data");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cart
        ,
        "Product added to cart successfully"
      )
    );
});


// remove product to cart
const removeProductToCart = asyncHandler( async(req, res) => {
  // get the product details from body
  // validate the details
  // verify token
  // check product is exist or not
  // check the user cart already created or not
  // if not created already then new create 
  // find the exist one and update the value
  // make the aggregate function to calculate the total price and total items
  

  const {productId, quantity} = req.body;

})

export {
  userAccountDelete,
  addProductToWishList,
  removeProductFromWishlist,
  viewWishlist,
  addProductToCart,
};
