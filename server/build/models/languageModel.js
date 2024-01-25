"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const languageSchema = new mongoose_1.default.Schema({
    language: {
        type: String,
        required: true
    },
    flag: {
        type: String,
    },
    list: {
        type: Boolean,
        required: true
    }
});
exports.Language = mongoose_1.default.model('languages', languageSchema);
