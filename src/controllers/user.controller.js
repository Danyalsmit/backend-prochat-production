const uploadToCloudinary = require("../utils/uploadToCloudinary");
const User = require("../models/user.model");

exports.uploadAvatar = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const result =
      await uploadToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      avatar: user.avatar,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed"
    });
  }
};