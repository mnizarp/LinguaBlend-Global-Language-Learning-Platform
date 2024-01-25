"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const countrySchema = new mongoose_1.default.Schema({
    country: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    list: {
        type: Boolean,
        required: true
    }
});
exports.Country = mongoose_1.default.model('countries', countrySchema);
