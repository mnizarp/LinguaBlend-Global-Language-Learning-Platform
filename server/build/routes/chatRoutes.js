"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const chatControllers_1 = require("../controllers/userControllers/chatControllers");
exports.chatRouter = (0, express_1.default)();
exports.chatRouter.post('/sendmessage', authMiddleware_1.protect, chatControllers_1.sendMessage);
exports.chatRouter.post('/getmessages', authMiddleware_1.protect, chatControllers_1.get_messages);
exports.chatRouter.get('/getchats', authMiddleware_1.protect, chatControllers_1.get_chats);
exports.chatRouter.get('/getunreadmessages', authMiddleware_1.protect, chatControllers_1.get_unread_messages);
exports.chatRouter.post('/getchatunreadmessages', authMiddleware_1.protect, chatControllers_1.get_chat_unread_messages);
exports.chatRouter.patch('/clearunreadmessages', authMiddleware_1.protect, chatControllers_1.clear_unread_messages);
