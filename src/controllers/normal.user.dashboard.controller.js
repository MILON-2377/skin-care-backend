import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cookiesOptions } from "../constansts.js";
import cloudinery from "cloudinary";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


// user account deletion 
const userAccountDelete = asyncHandler( async(req, res) => {
    // get user password
    // verify user token
    // verify user info
    // verify user password
    // delete the user
  
  
    const {password} = req.body;
  
    if(!password){
      throw new ApiError(400, "Password is required");
    }
  
    const user = await User.findById(req.user?._id);
  
  
    if(!user){
      throw new ApiError(404, "User not found");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if(!isPasswordValid){
      throw new ApiError(401, "Invalid password");
    }
  
    await User.findByIdAndDelete(user._id);
  
    return res
      .status(200)
      .json(
        new ApiResponse(200,{}, "User account deleted successfully")
      )
  
  
  
  });


export {
    userAccountDelete,
}