import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

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

export { registerUser };
