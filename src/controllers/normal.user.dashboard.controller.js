import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/Products.models.js";
import { Wishlist } from "../models/Wishlist.models.js";
import { Cart } from "../models/Cart.models.js";
import mongoose from "mongoose";
import { countTotalPriceAndItems } from "./aggregate.pipeline.controller.js";
const { ObjectId } = mongoose.Types;
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
  if (items.length === 0) {
    throw new ApiError(400, "At least one product details is required");
  }

  for (let item of items) {
    if (!item.productId) {
      throw new ApiError(400, "productId is required");
    }

    if (item.quantity === 0) {
      throw new ApiError(400, "At least one quantity is required");
    }

    if (item.quantity < 0) {
      throw new ApiError(400, "quantity can not be negative ");
    }
  }

  // get the user id
  const userId = req.user?._id;

  const productIds = items.map((i) => i.productId);

  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length === 0) {
    throw new ApiError(404, "No products found for the given productIds");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [...items],
      totalItems: Number(items.length),
    });
  } else {
    if (cart.items.length === 0) {
      cart.items = [...items];
    } else {
      for (let item of items) {
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId.toString() === item.productId.toString()
        );

        if (existingItemIndex !== 1) {
          cart.items[existingItemIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      }
    }
  }

  // save the updated cart
  await cart.save();

  const updatedCart = await countTotalPriceAndItems(userId);
  cart.totalItems = updatedCart.totalItems;
  cart.totalPrice = updatedCart.totalPrice;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product added to cart successfully"));
});

// remove product to cart
const removeProductToCart = asyncHandler(async (req, res) => {
  const items = req.body || [];

  if (items.length === 0) {
    throw new ApiError(400, "At least one product details are required");
  }

  for (let item of items) {
    if (!item.productId) {
      throw new ApiError(404, "productId is required");
    }
  }

  const userId = req.user?._id;

  let cart = await Cart.findOne({ userId });

  if (cart.length === 0) {
    throw new ApiError(404, "cart not found for this user");
  }

  for (let item of items) {
    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === item.productId.toString()
    );

    if (itemIndex === -1) {
      throw new ApiError(404, "Product not found in the cart");
    }

    cart.items.splice(itemIndex, 1);
  }

  await cart.save();

  if (cart.items.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product remove from cart successfully"));
  }

  const updatedCart = await countTotalPriceAndItems(userId);
  cart.totalPrice = updatedCart.totalPrice;
  cart.totalItems = updatedCart.totalItems;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "product remove from cart successfully"));
});

export {
  userAccountDelete,
  addProductToWishList,
  removeProductFromWishlist,
  viewWishlist,
  addProductToCart,
  removeProductToCart,
};
