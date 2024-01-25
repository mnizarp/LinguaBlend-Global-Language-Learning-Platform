"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    reporter_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    category: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    post_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'posts'
    },
    report_reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.Report = mongoose_1.default.model('reports', reportSchema);
