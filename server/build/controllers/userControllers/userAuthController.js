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
exports.contactAdmin = exports.clear_unread_notifications = exports.get_unread_notifications = exports.getNotifications = exports.getSuggestions = exports.searchUsers = exports.get_followings = exports.get_user_block_status = exports.report_user = exports.edit_profile = exports.follow_unfollow = exports.logout = exports.get_user_details = exports.finishProfile = exports.login_user = exports.verifyOtp = exports.clearOtp = exports.resendOtp = exports.create_google_user = exports.create_user = void 0;
const userModel_1 = require("../../models/userModel");
const countryModel_1 = require("../../models/countryModel");
const languageModel_1 = require("../../models/languageModel");
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const reportModel_1 = require("../../models/reportModel");
const otp_generator_1 = __importDefault(require("otp-generator"));
const password_generator_1 = __importDefault(require("password-generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const otpModel_1 = require("../../models/otpModel");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const chatModel_1 = require("../../models/chatModel");
const notificationModel_1 = require("../../models/notificationModel");
const contactAdminModel_1 = require("../../models/contactAdminModel");
const create_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userExists = yield userModel_1.User.findOne({ email });
        if (!userExists) {
            const newuser = new userModel_1.User({
                name,
                email,
                password,
                isAdmin: false,
                isBlocked: false,
                isProfileFinished: false,
                isGoogleLogin: false,
                isVerified: false,
                registered_on: new Date().toLocaleDateString(),
            });
            yield newuser.save();
            const token = (0, generateToken_1.default)(newuser._id);
            const OTP = otp_generator_1.default.generate(4, {
                digits: true,
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "nizarp666@gmail.com",
                    pass: process.env.EMAIL_PASS,
                },
            });
            var mailOptions = {
                from: "nizarp666@gmail.com",
                to: newuser.email,
                subject: "OTP VERIFICATION",
                text: "PLEASE ENTER THE OTP FOR VERIFY YOUR EMAIL " + OTP,
            };
            transporter.sendMail(mailOptions, function (error, info) { });
            const otps = yield otpModel_1.Otp.findOne({ email: newuser.email });
            if (!otps) {
                const otp = new otpModel_1.Otp({ email: newuser.email, otp: OTP });
                yield otp.save();
            }
            else {
                yield otpModel_1.Otp.updateOne({ email: newuser.email }, { $set: { otp: OTP } });
            }
            res.status(200).json({
                _id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                token,
            });
        }
        else if (userExists.isGoogleLogin == true) {
            res
                .status(402)
                .json({ message: "Already signed up with different Method" });
        }
        else {
            res.status(401).json({ message: "user already exists" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400);
    }
});
exports.create_user = create_user;
const create_google_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.body;
        const userExists = yield userModel_1.User.findOne({ email });
        const randomPassword = (0, password_generator_1.default)(8, false);
        if (!userExists) {
            const newuser = new userModel_1.User({
                name,
                email,
                password: randomPassword,
                isAdmin: false,
                isBlocked: false,
                isProfileFinished: false,
                isGoogleLogin: true,
                isVerified: true,
                registered_on: new Date().toLocaleDateString(),
            });
            yield newuser.save();
            const token = (0, generateToken_1.default)(newuser._id);
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "nizarp666@gmail.com",
                    pass: process.env.EMAIL_PASS,
                },
            });
            var mailOptions = {
                from: "nizarp666@gmail.com",
                to: newuser.email,
                subject: "LINGUABLEND PASSWORD",
                text: "USE THIS PASSWORD WHEN YOU LOGIN TO LINGUABLEND " + randomPassword,
            };
            transporter.sendMail(mailOptions, function (error, info) { });
            res.status(200).json({
                _id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                isGoogleLogin: newuser.isGoogleLogin,
                token,
            });
        }
        else {
            if (userExists.isBlocked == true) {
                res.status(403).json({ message: 'user got blocked by admin' });
            }
            const token = (0, generateToken_1.default)(userExists._id);
            res.status(200).json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                isGoogleLogin: userExists.isGoogleLogin,
                isProfileFinished: userExists.isProfileFinished,
                photo: userExists.photo,
                token,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400);
    }
});
exports.create_google_user = create_google_user;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail } = req.body;
        const OTP = otp_generator_1.default.generate(4, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "nizarp666@gmail.com",
                pass: process.env.EMAIL_PASS,
            },
        });
        var mailOptions = {
            from: "nizarp666@gmail.com",
            to: userEmail,
            subject: "OTP VERIFICATION",
            text: "PLEASE ENTER THE OTP FOR VERIFY YOUR EMAIL " + OTP,
        };
        transporter.sendMail(mailOptions, function (error, info) { });
        const otps = yield otpModel_1.Otp.findOne({ email: userEmail });
        if (!otps) {
            const otp = new otpModel_1.Otp({ email: userEmail, otp: OTP });
            yield otp.save();
        }
        else {
            yield otpModel_1.Otp.updateOne({ email: userEmail }, { $set: { otp: OTP } });
        }
        res.status(200).json({ message: 'Otp sent successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Otp sending failed' });
    }
});
exports.resendOtp = resendOtp;
const clearOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail } = req.body;
        yield otpModel_1.Otp.deleteOne({ email: userEmail });
        res.status(200).json({ message: 'otp cleared' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'otp clearing failed' });
    }
});
exports.clearOtp = clearOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const otpexists = yield otpModel_1.Otp.findOne({ email });
        if (otpexists) {
            if (otpexists.otp == otp) {
                yield userModel_1.User.updateOne({ email }, { $set: { isVerified: true } });
                const userDetails = yield userModel_1.User.findOne({ email });
                const token = (0, generateToken_1.default)(userDetails === null || userDetails === void 0 ? void 0 : userDetails._id);
                res.status(200).json({
                    _id: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id,
                    name: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
                    email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
                    token,
                });
            }
            else {
                res.status(402).json({ message: "incorrect otp" });
            }
        }
        else {
            res.status(403).json({ message: "otp not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "otp verification failed" });
    }
});
exports.verifyOtp = verifyOtp;
const login_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (user && (yield user.matchPasswords(password))) {
            if (user.isBlocked == false) {
                const token = (0, generateToken_1.default)(user._id);
                res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isProfileFinished: user.isProfileFinished,
                    photo: user.photo,
                    token,
                });
            }
            else {
                res.status(402).json({ message: "User is blocked by admin" });
            }
        }
        else {
            res.status(401).json({ message: "invalid email or password" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400);
    }
});
exports.login_user = login_user;
const finishProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { language, country, userId, photo } = req.body;
        const uploadResponse = yield cloudinary_1.default.uploader.upload(photo, {
            upload_preset: "linguaBlend",
        });
        const countryInfo = yield countryModel_1.Country.findOne({ country });
        const languageInfo = yield languageModel_1.Language.findOne({ language });
        yield userModel_1.User.findByIdAndUpdate({ _id: userId }, {
            $set: {
                country_id: countryInfo === null || countryInfo === void 0 ? void 0 : countryInfo._id,
                language_id: languageInfo === null || languageInfo === void 0 ? void 0 : languageInfo._id,
                photo: uploadResponse,
                isProfileFinished: true,
            },
        });
        res.status(200).json({ photo: uploadResponse, isProfileFinished: true });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "profile not completed" });
    }
});
exports.finishProfile = finishProfile;
const get_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
        const userDetails = yield userModel_1.User.aggregate([
            {
                $match: { _id: userIdObject },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "followingDetails",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers",
                    foreignField: "_id",
                    as: "followersDetails",
                },
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
                    followers: 1,
                    following: 1,
                    "country.country": 1,
                    "country.flag": 1,
                    "language.language": 1,
                    "language.flag": 1,
                    followingDetails: 1,
                    followersDetails: 1,
                },
            },
        ]);
        res.status(200).json(userDetails);
    }
    catch (error) {
        console.log(error);
    }
});
exports.get_user_details = get_user_details;
const logout = (req, res) => {
    try {
        res.status(200).json({ message: "Logged out " });
    }
    catch (error) {
        console.log(error);
    }
};
exports.logout = logout;
const follow_unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileId } = req.body;
        const userId = req.userId;
        const isAlreadyFollowing = yield userModel_1.User.find({
            _id: userId,
            following: { $in: [profileId] },
        });
        const isFollowingBack = yield userModel_1.User.find({
            _id: userId,
            followers: { $in: [profileId] },
        });
        if (isAlreadyFollowing.length > 0) {
            yield userModel_1.User.updateOne({ _id: userId }, { $pull: { following: profileId } });
            yield userModel_1.User.updateOne({ _id: profileId }, { $pull: { followers: userId } });
            yield notificationModel_1.Notification.deleteOne({
                user_id: profileId,
                sender_id: userId,
                type: "Follow",
            });
            res.status(200).json({ following: false, message: "unfollow updated" });
        }
        else {
            yield userModel_1.User.updateOne({ _id: userId }, { $push: { following: profileId } });
            yield userModel_1.User.updateOne({ _id: profileId }, { $push: { followers: userId } });
            const newnotification = new notificationModel_1.Notification({
                user_id: profileId,
                sender_id: userId,
                type: "Follow",
                unread: true,
            });
            yield newnotification.save();
            if (isFollowingBack.length > 0) {
                const chat = yield chatModel_1.Chat.findOne({
                    $and: [
                        { users: { $elemMatch: { $eq: userId } } },
                        { users: { $elemMatch: { $eq: profileId } } },
                    ],
                });
                if (!chat) {
                    const newchat = new chatModel_1.Chat({
                        users: [userId, profileId],
                    });
                    newchat.save();
                }
            }
            res.status(200).json({ following: true, newnotification });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "follow unfollow failed" });
    }
});
exports.follow_unfollow = follow_unfollow;
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { photo, name, email, country, language, password } = req.body;
        const uploadResponse = yield cloudinary_1.default.uploader.upload(photo, {
            upload_preset: "linguaBlend",
        });
        if (photo) {
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { photo: uploadResponse } });
        }
        if (name) {
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { name } });
        }
        if (email) {
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { email } });
        }
        if (language) {
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { language } });
        }
        if (country) {
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { country } });
        }
        if (password) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            yield userModel_1.User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
        }
        const updatedInfo = yield userModel_1.User.findById({ _id: userId }, { _id: 1, name: 1, email: 1, photo: 1, isProfileFinished: 1 });
        res.status(200).json({ updatedInfo, message: "edited profile" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "edit profile failed" });
    }
});
exports.edit_profile = edit_profile;
const report_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportReason } = req.body;
        const reporterId = req.userId;
        const newreport = new reportModel_1.Report({
            category: "user",
            reporter_id: reporterId,
            user_id: userId,
            report_reason: reportReason,
        });
        newreport.save();
        res.status(200).json({ message: "report submitted" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "report failed" });
    }
});
exports.report_user = report_user;
const get_user_block_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const blockstatus = yield userModel_1.User.findById(userId, { isBlocked: 1 });
        res.status(200).json({ blockStatus: blockstatus === null || blockstatus === void 0 ? void 0 : blockstatus.isBlocked });
    }
    catch (error) {
        console.log("fetching failed");
        res.status(400).json({ message: "fetching user block status failed" });
    }
});
exports.get_user_block_status = get_user_block_status;
const get_followings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const allfollowings = yield userModel_1.User.findById(userId, {
            following: 1,
        }).populate("following");
        res.status(200).json(allfollowings === null || allfollowings === void 0 ? void 0 : allfollowings.following);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "followings fetching failed" });
    }
});
exports.get_followings = get_followings;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchInput = req.query.search;
        const regex = new RegExp(searchInput, "i");
        const users = yield userModel_1.User.find({
            name: { $regex: regex },
            isAdmin: false,
            isProfileFinished: true,
            isBlocked: false,
            _id: { $ne: req.userId },
        });
        res.status(200).send(users);
    }
    catch (error) {
        console.log(error);
        res.status(400);
    }
});
exports.searchUsers = searchUsers;
const getSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const allsuggestions = yield userModel_1.User.find({
            _id: { $ne: req.userId },
            isAdmin: false,
            isBlocked: false,
            isVerified: true,
            followers: { $nin: [userId] },
        }).populate("language_id");
        res.status(200).json({ allsuggestions });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "suggestions fetching failed" });
    }
});
exports.getSuggestions = getSuggestions;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const notifications = yield notificationModel_1.Notification.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .populate("sender_id");
        res.status(200).json({ notifications });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "notifications fetching failed" });
    }
});
exports.getNotifications = getNotifications;
const get_unread_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const unreadnotifications = yield notificationModel_1.Notification.find({
            user_id: userId,
            unread: true,
        });
        res.status(200).json({ unreadnotifications });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "unread notifications fetching failed" });
    }
});
exports.get_unread_notifications = get_unread_notifications;
const clear_unread_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        yield notificationModel_1.Notification.updateMany({ user_id: userId }, { $set: { unread: false } });
        res.status(200).json({ message: "Ok" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "clearing failed" });
    }
});
exports.clear_unread_notifications = clear_unread_notifications;
const contactAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, userEmail, content } = req.body;
        const newadmincontact = new contactAdminModel_1.ContactAdmin({
            user_name: userName,
            user_email: userEmail,
            content
        });
        newadmincontact.save();
        res.status(200).json({ message: 'contacted admin successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'contacting admin failed' });
    }
});
exports.contactAdmin = contactAdmin;
