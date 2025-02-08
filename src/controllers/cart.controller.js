import { Cart } from "../models/Cart.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get cart items
const getCartItems = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    // console.log("get cart controller fn userid: ",userId);

    if (!userId) {
      throw new ApiError(404, "Authentication failed: User ID is missing");
    }

    const cart =
      (await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name price image",
      })) || [];

    if (!cart) {
      throw new ApiError(404, "Cart not found for the user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart items fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      `Error occured in getCartItems function: ${error.message}`
    );
  }
});

// Add product to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const itemPrice = price;

  // console.log(productId, quantity, price);

  if (!productId || quantity <= 0 || !price) {
    throw new ApiError(400, "Product ID and a valid quantitfy are requried");
  }

  const userId = req?.user?._id;

  if (!userId) {
    throw new ApiError(400, "Authentication failed: User ID is missing");
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {

      const isProductExist = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      console.log("is product exist ",isProductExist)

      if (isProductExist !== -1) {
        throw new ApiError(400, "Product already exists in the cart");
      }

      cart.items.push({ productId, quantity });
      cart.totalItems += 1;
      cart.totalPrice += quantity * itemPrice;
    } else {
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity }],
        totalItems: 1,
        totalPrice: quantity * itemPrice,
      });

      await newCart.save();

      return res
        .status(200)
        .json(
          new ApiResponse(200, newCart, "Product added to the cart successfull")
        );
    }

    await cart.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, cart, "Product added to the cart successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error occured in addItemToCart fn", error);
  }
});

export { addItemToCart, getCartItems };
