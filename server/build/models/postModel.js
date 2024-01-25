"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    post_image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
    },
    likes: {
        type: Array,
    },
    isHide: {
        type: Boolean,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});
exports.Post = mongoose_1.default.model('posts', postSchema);
