import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.models.js";
import { ApiResponse } from "../utils/apiResponse.js";




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

  const createUser = await User.findById(user._id).select("-password -refreshToken");

  if(!createUser){
    throw new ApiError(500, "User not registered server internal error please try after a while")
  }

  return res.status(201).json(
    new ApiResponse(200, createUser, "User registered successfully")
  );
  
});

// user info updation
const updateUser = asyncHandler(async (req, res) => {
  const { street, city, postalCode, phone } = req.body;

  // console.log(userId);

  // validation form update info
  if (
    [street, city, postalCode].some(
      (element) => element?.trim() === "" || element === undefined
    )
  ) {
    throw new ApiError(400, "All field are required");
  }

  // check is user exist or not

  // get the avatar file and validate
  const avatarLocalPath = req.files?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "user update successfully"));
});

export { registerUser, updateUser };
