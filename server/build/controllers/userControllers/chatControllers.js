"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear_unread_messages = exports.get_chat_unread_messages = exports.get_unread_messages = exports.get_chats = exports.get_messages = exports.sendMessage = void 0;
const chatModel_1 = require("../../models/chatModel");
const messageModel_1 = require("../../models/messageModel");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.userId;
        const reciever = req.body.recieverId;
        const content = req.body.message;
        const chat = yield chatModel_1.Chat.findOne({
            $and: [
                { users: { $elemMatch: { $eq: sender } } },
                { users: { $elemMatch: { $eq: reciever } } },
            ],
        });
        if (chat) {
            try {
                const newmessage = new messageModel_1.Message({
                    sender_id: sender,
                    content,
                    chat_id: chat._id,
                    unread: true,
                    user_id: reciever
                });
                newmessage.save();
                yield chatModel_1.Chat.findByIdAndUpdate({ _id: chat._id }, { $set: { latest_message: newmessage._id } });
                const messagedata = yield messageModel_1.Message.findById(newmessage._id).populate("chat_id");
                res.status(200).json({ message: messagedata });
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            const newchat = new chatModel_1.Chat({
                users: [sender, reciever],
            });
            newchat.save();
            try {
                const newmessage = new messageModel_1.Message({
                    sender_id: sender,
                    content,
                    chat_id: newchat._id,
                    unread: true,
                    user_id: reciever
                });
                newmessage.save();
                yield chatModel_1.Chat.findByIdAndUpdate({ _id: newchat._id }, { $set: { latest_message: newmessage._id } });
                const messagedata = yield messageModel_1.Message.findById(newmessage._id).populate("chat_id");
                res.status(200).json({ message: messagedata });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Message sending failed" });
    }
});
exports.sendMessage = sendMessage;
const get_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { secondUserId } = req.body;
        const chat = yield chatModel_1.Chat.findOne({
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: secondUserId } } },
            ],
        });
        const allmessages = yield messageModel_1.Message.find({ chat_id: chat === null || chat === void 0 ? void 0 : chat._id }).sort({
            createdAt: -1,
        });
        res.status(200).json({ allmessages, chatId: chat === null || chat === void 0 ? void 0 : chat._id });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "messages fetching failed" });
    }
});
exports.get_messages = get_messages;
const get_chats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const allchats = yield chatModel_1.Chat.find({ users: { $elemMatch: { $eq: userId } } })
            .populate({
            path: "users",
            match: { _id: { $ne: userId } },
        })
            .populate("latest_message");
        res.status(200).json(allchats);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "chats fetching failed" });
    }
});
exports.get_chats = get_chats;
const get_unread_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const unreadmessages = yield messageModel_1.Message.find({
            user_id: userId,
            unread: true,
        });
        res.status(200).json({ unreadmessages });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "unread messages fetching failed" });
    }
});
exports.get_unread_messages = get_unread_messages;
const get_chat_unread_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { chatId } = req.body;
        const chatunreadmessages = yield messageModel_1.Message.find({
            user_id: userId,
            chat_id: chatId,
            unread: true
        });
        res.status(200).json({ chatunreadmessages });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'chat unread messages fetching failed' });
    }
});
exports.get_chat_unread_messages = get_chat_unread_messages;
const clear_unread_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { chatId } = req.body;
        yield messageModel_1.Message.updateMany({ user_id: userId, chat_id: chatId }, { $set: { unread: false } });
        res.status(200).json({ message: "Ok" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "clearing failed" });
    }
});
exports.clear_unread_messages = clear_unread_messages;
