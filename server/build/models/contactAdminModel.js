"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contactAdminSchema = new mongoose_1.default.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.ContactAdmin = mongoose_1.default.model('contact_admin', contactAdminSchema);
