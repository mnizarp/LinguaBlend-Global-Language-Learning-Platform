"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.Comment = mongoose_1.default.model('comments', commentSchema);
