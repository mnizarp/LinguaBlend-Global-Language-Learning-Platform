"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sessionMessageSchema = new mongoose_1.default.Schema({
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        trim: true
    },
    session_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'sessions'
    }
}, {
    timestamps: true
});
exports.SessionMessage = mongoose_1.default.model('sessionmessages', sessionMessageSchema);
