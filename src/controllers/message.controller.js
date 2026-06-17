const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

exports.sendMessage = asyncHandler(async (req, res) => {

    const { chatId, content } = req.body;

    if (!chatId || !content) {
        throw new ApiError(400, "chatId and content required");
    }

    // 1. check chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // 2. check user is part of chat
    const isParticipant = chat.participants
        .some(
            (id) => id.toString() === req.user._id.toString()
        );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not part of this chat"
        );
    }

    // 3. create message
    let message = await Message.create({
        sender: req.user._id,
        content,
        chat: chatId
    });

    // 4. populate sender
    message = await message.populate("sender", "fullName avatar");

    // 5. update latest message
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id
    });

    return res.status(201).json(
        new ApiResponse(201, message, "Message sent")
    );
});


exports.getMessages = asyncHandler(async (req, res) => {

    const { chatId } = req.params;

    if (!chatId) {
        throw new ApiError(400, "ChatId required");
    }

    // check chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // check user permission
    const isParticipant = chat.participants
        .some(
            (id) => id.toString() === req.user._id.toString()
        );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not part of this chat"
        );
    }

    const messages = await Message.find({ chat: chatId })
        .populate("sender", "fullName avatar")
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched")
    );
});