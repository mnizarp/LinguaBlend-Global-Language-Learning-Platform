"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saved = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const savedSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    post_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'posts'
    }
});
exports.Saved = mongoose_1.default.model('saved', savedSchema);
