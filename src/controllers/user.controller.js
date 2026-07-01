const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const User = require("../models/user.model");

exports.getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const query = { _id: { $ne: req.user._id } };

  if (search.trim()) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .limit(50);

  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched")
  );
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  const result = await uploadToCloudinary(req.file.buffer);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, { avatar: user.avatar }, "Avatar updated")
  );
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Current user fetched")
  );
});
