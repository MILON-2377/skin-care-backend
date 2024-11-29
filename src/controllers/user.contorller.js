import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cookiesOptions } from "../constansts.js";




// generate access and refresh token
const generateAccessAndRefreshToken = async(userId) => {
  try {

    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}


// user registation
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  // validation check of user info
  if ([userName, email, password].some((element) => element?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  // check is user exist or not
  const existUser = await User.findOne({
    email,
  });

  if (existUser) {
    throw new ApiError(409, "User with email is already exist");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password
  });

  // generate access and refresh token
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const createUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createUser){
    throw new ApiError(500, "User not registered server internal error please try after a while")
  }

  return res
  .status(201)
  .cookie('accessToken', accessToken, cookiesOptions)
  .cookie("refreshToken", refreshToken, cookiesOptions)
  .json(
    new ApiResponse(200, createUser, "User registered successfully")
  );
  
});

// user info updation
const updateUser = asyncHandler(async (req, res) => {

  // validate the user info
  // verify the user authorization
  // find the user info
  // update the user info
  // return the updated user info with response


  const { street, city, postalCode, phone } = req.body;


  // validation form update info
  if (
    [street, city, postalCode, phone].some(
      (element) => element?.trim() === "" || element === undefined
    )
  ) {
    throw new ApiError(400, "All field are required");
  }


  const updateData = {
    phone,
    address:{
      street,
      city,
      postalCode,
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateData
    },
    {
      new: true
    }
  ).select("-password -refreshToken");


  

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user update successfully"));
});

export { registerUser, updateUser };
