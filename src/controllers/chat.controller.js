const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

exports.accessChat = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    // 1. validate input
    if (!userId) {
        throw new ApiError(400, "UserId is required");
    }

    // 2. validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    // 3. prevent self chat
    if (req.user._id.toString() === userId.toString()) {
        throw new ApiError(
            400,
            "You cannot create chat with yourself"
        );
    }

    // 4. check if user exists
    const receiver = await User.findById(userId);

    if (!receiver) {
        throw new ApiError(404, "User not found");
    }

    // 5. check existing chat
    let chat = await Chat.findOne({
        isGroupChat: false,
        participants: {
            $all: [req.user._id, userId]
        }
    }).populate("participants", "-password");

    // 6. return existing chat
    if (chat) {
        return res.status(200).json(
            new ApiResponse(200, chat, "Chat found")
        );
    }

    // 7. create new chat
    const newChat = await Chat.create({
        chatName: "private chat",
        isGroupChat: false,
        participants: [req.user._id, userId]
    });

    const fullChat = await Chat.findById(newChat._id)
        .populate("participants", "-password");

    // 8. response
    return res.status(201).json(
        new ApiResponse(201, fullChat, "Chat created")
    );
});