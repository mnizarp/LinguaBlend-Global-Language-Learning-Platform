"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        trim: true
    },
    chat_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'chats'
    },
    unread: {
        type: Boolean
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});
exports.Message = mongoose_1.default.model('messages', messageSchema);
