const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const protect = require("../middlewares/auth.middleware");
const { uploadAvatar } = require("../controllers/user.controller");

router.post(
  "/avatar",
  protect,
  upload.single("image"),
  uploadAvatar
);

module.exports = router;