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
exports.getAdminContacts = exports.getAllPosts = exports.getsessions = exports.get_new_users = exports.get_user_details = exports.get_user_reports = exports.user_block_unblock = exports.get_users = exports.adminLogin = void 0;
const userModel_1 = require("../../models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const reportModel_1 = require("../../models/reportModel");
const sessionModel_1 = require("../../models/sessionModel");
const postModel_1 = require("../../models/postModel");
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const contactAdminModel_1 = require("../../models/contactAdminModel");
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield userModel_1.User.findOne({ email, isAdmin: true });
        if (admin && (yield admin.matchPasswords(password))) {
            const token = (0, generateToken_1.default)(admin._id);
            res.status(200).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token,
            });
        }
        else {
            res.status(402).json({ message: "Invalid Credentials" });
        }
    }
    catch (error) {
        res.status(400);
        console.log("admin login failed");
    }
});
exports.adminLogin = adminLogin;
const get_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.User.aggregate([
            {
                $match: { isAdmin: false, isProfileFinished: true },
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "country_id",
                    foreignField: "_id",
                    as: "country",
                },
            },
            {
                $unwind: "$country",
            },
            {
                $lookup: {
                    from: "languages",
                    localField: "language_id",
                    foreignField: "_id",
                    as: "language",
                },
            },
            {
                $unwind: "$language",
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    photo: 1,
                    registered_on: 1,
                    isBlocked: 1,
                    "country.country": 1,
                    "country.flag": 1,
                    "language.language": 1,
                    "language.flag": 1,
                },
            },
        ]);
        res.status(200).json({ allUsers });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "getting users failed" });
    }
});
exports.get_users = get_users;
const user_block_unblock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
        yield userModel_1.User.findByIdAndUpdate({ _id: userId }, [
            {
                $set: {
                    isBlocked: {
                        $cond: {
                            if: { $eq: ["$isBlocked", true] },
                            then: false,
                            else: true,
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ message: "block update done" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "block update failed" });
    }
});
exports.user_block_unblock = user_block_unblock;
const get_user_reports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alluserreports = yield reportModel_1.Report.aggregate([
            {
                $match: { category: "user" },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reporter_id",
                    foreignField: "_id",
                    as: "reporter",
                },
            },
            {
                $unwind: "$reporter",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
        ]);
        res.status(200).json({ alluserreports });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "failed fetching all userreports" });
    }
});
exports.get_user_reports = get_user_reports;
const get_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        const userdetails = yield userModel_1.User.findById(userId)
            .populate("country_id")
            .populate("language_id")
            .select("-password");
        res.status(200).json({ userdetails });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "userdetails fetching failed" });
    }
});
exports.get_user_details = get_user_details;
const get_new_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newusers = yield userModel_1.User.find({
            isAdmin: false,
            isBlocked: false,
            isProfileFinished: true,
        })
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({ newusers });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "new users fetching failed" });
    }
});
exports.get_new_users = get_new_users;
const getsessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allsessions = yield sessionModel_1.Session.find({}).populate("language");
        res.status(200).json({ allsessions });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "sessions fetching failed" });
    }
});
exports.getsessions = getsessions;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allposts = yield postModel_1.Post.find({ isDeleted: false, isHide: false });
        res.status(200).json({ allposts });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "all posts fetching failed" });
    }
});
exports.getAllPosts = getAllPosts;
const getAdminContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admincontacts = yield contactAdminModel_1.ContactAdmin.find({}).sort({ createdAt: -1 });
        res.status(200).json(admincontacts);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'admin contacts fetching failed' });
    }
});
exports.getAdminContacts = getAdminContacts;
