"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    cloud_name: "dpoqctbdd",
    api_key: "956477591667156",
    api_secret: "OIP3UXUtAl8i5Ip4FXX0L6wYQrE"
});
exports.default = cloudinary;
