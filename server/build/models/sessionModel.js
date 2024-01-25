"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    language: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'languages'
    },
    difficulty: {
        type: String,
        required: true
    },
    host: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    members: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
}, {
    timestamps: true
});
exports.Session = mongoose_1.default.model('sessions', sessionSchema);
