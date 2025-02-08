import { Wishlist } from "../models/Wishlist.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// get wishlist
const getWishlist = asyncHandler(async(req, res) => {
  const userId = req.user?._id;

  // console.log(userId);

  if(!userId){
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const wishlist = await Wishlist.findOne({userId});

    // console.log(wishlist);

    if(!wishlist){
      throw new ApiError(404, "Wishlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, wishlist, "Wishlist retrive successfully"))

  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error occured while geting wishlist data");
    
  }

});



// add wishlist
const addProductsToWishlist = asyncHandler(async (req, res) => {
  try {
    const  {id}  = req.body;
    const userId = req.user?._id;


    if (!id) {
      throw new ApiError(400, "Product Id is required");
    }

    let wishlist = await Wishlist.findOne({userId});

    if(!wishlist){
        wishlist = new Wishlist({userId, wishList: [id]});
    }else{
        if(wishlist.wishList.includes(id)){
            throw new ApiError(400, "Product already in wishlist");
        }

        wishlist.wishList.push(id);
    }
  
    await wishlist.save();

    return res
      .status(201)
      .json(new ApiResponse(201, wishlist, "Product added to wishlist successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export { addProductsToWishlist, getWishlist };
