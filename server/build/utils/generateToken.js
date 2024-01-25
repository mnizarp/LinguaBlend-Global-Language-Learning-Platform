"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d'
    });
    return token;
    // res.cookie('jwt',token,{
    //  httpOnly:true,
    //  sameSite:'strict',
    //  secure:false,
    //  maxAge:30*24*60*60*1000
    // })
};
exports.default = generateToken;
