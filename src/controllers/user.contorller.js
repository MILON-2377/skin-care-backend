import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


// user registation
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email } = req.body;


  // validation check of user info
  if ([userName, email].some((element) => element?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  // check is user exist or not
  const existUser = await User.findOne({
    email,
  });


  if (existUser) {
    throw new ApiError(409, "User with email is already exist");
  }

  // create user
  const createUser = await User.create({
    userName,
    email,
  });

  if (!createUser) {
    throw new ApiError(
      500,
      "Server internal problem please try again after a while"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfully"));
});

// user info updation
const updateUser = asyncHandler(async(req, res) => {
    const {street, city, postalCode} = req.body;
    const {userId} = req.params;

    // console.log(userId);


    // validation form update info
    if([street, city, postalCode].some((element) => element?.trim() === "" || element === undefined )){
        throw new ApiError(400, "All field are required");
    }


    // check is user exist or not



    // get the avatar file and validate
    const avatarLocalPath = req.files?.path;


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    

    return res.status(201).json(
        new ApiResponse(200, {}, "user update successfully")
    )
});

export { 
    registerUser,
    updateUser,
 };
