import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cookiesOptions } from "../constansts.js";
import cloudinery from "cloudinary";
import {uploadOnCloudinary} from "../utils/cloudinary.js";



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

  const count = await User.countDocuments({email});

  if(count > 0){
    throw new ApiError(409, "Email already exist. Try to another email");
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
  }).select("-password -refreshToken");

  // generate access and refresh token
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);


  if(!user){
    throw new ApiError(500, "User not registered server internal error please try after a while")
  }

  return res
  .status(201)
  .cookie('accessToken', accessToken, cookiesOptions)
  .cookie("refreshToken", refreshToken, cookiesOptions)
  .json(
    new ApiResponse(200, user, "User registered successfully")
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



// delete user avatar photo
const deleteUserAvatar = asyncHandler( async(req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if(!user || !user.avatar){
    throw new ApiError(404, "User or Avatar not found");
  }

  // extract public_id from the cloudinery url
  const publicId = user.avatar.split('/').pop().split('.')[0];

  // delete the image from cloudinery
  await cloudinery.uploader.destroy(publicId);

  // remove the avatar url from db
  user.avatar = '';
  await User.sava();

  res
  .status(200)
  .json(
    new ApiResponse(200, "Avatar deleted successfully")
  )

});


// update user avatar photo
const updateUserAvatar = asyncHandler( async(req, res) => {

  const avatarLocalPath = req.file?.path;

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken");


  res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar image updated successfully")
    )

});



// login user
const loginUser = asyncHandler( async(req, res) => {

  const {email, password} = req.body;

  // console.log(email);

  if(!email && !password){
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(
    user._id,
  ).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse(200, {
        user: loggedInUser
      })
    )

});

export { 
  registerUser, 
  updateUser,
  updateUserAvatar,
  loginUser,
};
