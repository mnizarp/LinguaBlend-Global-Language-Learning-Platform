"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProtect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                // const che=await User.findById(decoded?.userId ).select('-password')
                // const userId = decoded?.userId;
                // req.userId=userId
                next();
            }
            catch (error) {
                res.status(401);
                throw new Error("Not authorized,invalid token");
            }
        }
        else {
            res.status(401);
            throw new Error("Not authorized,no token");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Server Error");
    }
});
exports.adminProtect = adminProtect;
