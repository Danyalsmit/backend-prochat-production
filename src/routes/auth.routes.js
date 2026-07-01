const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");

// 👇 THIS IS REQUIRED
router.post(
    "/signup",
    upload.single("avatar"),
    authController.signup
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;