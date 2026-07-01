const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const protect = require("../middlewares/auth.middleware");
const { uploadAvatar, getUsers, getCurrentUser } = require("../controllers/user.controller");

router.get("/", protect, getUsers);
router.get("/search", protect, getUsers);
router.get("/me", protect, getCurrentUser);

router.post(
  "/avatar",
  protect,
  upload.single("image"),
  uploadAvatar
);

module.exports = router;