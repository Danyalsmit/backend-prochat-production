const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

const signupUser = async ({ fullName, email, password, avatar }) => {

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: avatar || ""
  });

  const token = generateToken(user._id);

  user.password = undefined;

  return { user, token };
};
const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(user._id);

  user.password = undefined;

  return { user, token };
};

module.exports = {
  signupUser,
  loginUser,
};