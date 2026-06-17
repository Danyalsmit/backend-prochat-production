const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const cookieOptions = require("../utils/cookieOptions");

const {
  signupUser,
  loginUser
} = require("../services/auth.service");

exports.signup = asyncHandler(async (req, res) => {

  const file = req.file;

  let avatarUrl = "";

  // agar image aayi hai
  if (file) {
    const uploadToCloudinary = require("../utils/uploadToCloudinary");

    const result = await uploadToCloudinary(file.buffer);

    avatarUrl = result.secure_url;
  }

  const { user, token } = await signupUser({
    ...req.body,
    avatar: avatarUrl
  });

  res.cookie("token", token, cookieOptions);

  return res.status(201).json(
    new ApiResponse(201, user, "User created successfully")
  );
});
exports.login = asyncHandler(async (req, res) => {

  const { user, token } = await loginUser(req.body);

  res.cookie("token", token, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      { user },
      "Login successful"
    )
  );
});