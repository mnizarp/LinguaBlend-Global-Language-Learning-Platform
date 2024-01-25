"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    type: {
        type: String,
    },
    unread: {
        type: Boolean
    }
}, {
    timestamps: true
});
exports.Notification = mongoose_1.default.model('notifications', notificationSchema);
