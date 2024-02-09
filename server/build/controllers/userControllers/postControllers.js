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
exports.get_saved_posts = exports.checkSaved = exports.unsavePost = exports.savePost = exports.edit_comment = exports.report_post = exports.edit_post = exports.delete_post = exports.like_unlike = exports.get_comments = exports.add_comment = exports.get_posts = exports.create_post = void 0;
const postModel_1 = require("../../models/postModel");
const commentModel_1 = require("../../models/commentModel");
const mongoose_1 = __importDefault(require("mongoose"));
const reportModel_1 = require("../../models/reportModel");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const notificationModel_1 = require("../../models/notificationModel");
const savedModel_1 = require("../../models/savedModel");
const create_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, userId, postImage } = req.body;
        const uploadResponse = yield cloudinary_1.default.uploader.upload(postImage, {
            upload_preset: "linguaBlend",
        });
        const newpost = new postModel_1.Post({
            user_id: userId,
            caption,
            post_image: uploadResponse.url,
            isHide: false,
            isDeleted: false,
        });
        yield newpost.save();
        res.status(200).json({ message: "post added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "post adding failed" });
    }
});
exports.create_post = create_post;
const get_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) {
            const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
            const allposts = yield postModel_1.Post.aggregate([
                {
                    $match: { isDeleted: false, isHide: false, user_id: userIdObject },
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
                {
                    $project: {
                        _id: 1,
                        post_image: 1,
                        likes: 1,
                        caption: 1,
                        "user.name": 1,
                        "user._id": 1,
                        "user.photo": 1,
                        createdAt: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ]);
            res.status(200).json({ allposts });
        }
        else {
            const allposts = yield postModel_1.Post.aggregate([
                {
                    $match: { isHide: false, isDeleted: false },
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
                {
                    $project: {
                        _id: 1,
                        post_image: 1,
                        caption: 1,
                        likes: 1,
                        "user.name": 1,
                        "user._id": 1,
                        "user.photo": 1,
                        createdAt: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ]);
            res.status(200).json({ allposts });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.get_posts = get_posts;
const add_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, userId, comment } = req.body;
        const newcomment = new commentModel_1.Comment({
            user_id: userId,
            post_id: postId,
            comment,
        });
        yield newcomment.save();
        res.status(200).json({ message: "comment added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "comment not added" });
    }
});
exports.add_comment = add_comment;
const get_comments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        const postIdObject = new mongoose_1.default.Types.ObjectId(postId);
        const allcomments = yield commentModel_1.Comment.aggregate([
            {
                $match: { post_id: postIdObject },
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
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user._id": 1,
                    "user.photo": 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
        res.status(200).json({ allcomments });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "failed fetching all comments" });
    }
});
exports.get_comments = get_comments;
const like_unlike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        const user = req.userId;
        const post = yield postModel_1.Post.findOne({ _id: postId });
        const isAlreadyLiked = yield postModel_1.Post.find({
            _id: postId,
            likes: { $in: [user] },
        });
        if (isAlreadyLiked.length > 0) {
            yield postModel_1.Post.updateOne({ _id: postId }, { $pull: { likes: user } });
            yield notificationModel_1.Notification.deleteOne({
                user_id: post === null || post === void 0 ? void 0 : post.user_id,
                sender_id: user,
                type: "Like",
            });
            res.status(200).json({ liked: false, message: "unliked the post" });
        }
        else {
            yield postModel_1.Post.updateOne({ _id: postId }, { $push: { likes: user } });
            let newnotification;
            if ((post === null || post === void 0 ? void 0 : post.user_id.toString()) !== user) {
                newnotification = new notificationModel_1.Notification({
                    user_id: post === null || post === void 0 ? void 0 : post.user_id,
                    sender_id: user,
                    type: "Like",
                    unread: true,
                });
                yield newnotification.save();
            }
            res.status(200).json({ liked: true, newnotification });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.like_unlike = like_unlike;
const delete_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        yield postModel_1.Post.findByIdAndUpdate({ _id: postId }, { isDeleted: true });
        res.status(200).json({ message: "post deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "post deletion failed" });
    }
});
exports.delete_post = delete_post;
const edit_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, newCaption } = req.body;
        yield postModel_1.Post.findByIdAndUpdate({ _id: postId }, { $set: { caption: newCaption } });
        res.status(200).json({ message: "caption updated" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "caption not updated" });
    }
});
exports.edit_post = edit_post;
const report_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, reportReason } = req.body;
        const reporterId = req.userId;
        const newreport = new reportModel_1.Report({
            category: "post",
            reporter_id: reporterId,
            post_id: postId,
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
exports.report_post = report_post;
const edit_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { editedComment, commentId } = req.body;
        yield commentModel_1.Comment.findByIdAndUpdate(commentId, {
            $set: { comment: editedComment },
        });
        res.status(200).json({ message: "comment edited" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "comment editing failed" });
    }
});
exports.edit_comment = edit_comment;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { postId } = req.body;
        const newsavedpost = new savedModel_1.Saved({
            post_id: postId,
            user_id: userId
        });
        yield newsavedpost.save();
        res.status(200).json({ message: 'post saved successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'post saving failed' });
    }
});
exports.savePost = savePost;
const unsavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { postId } = req.body;
        yield savedModel_1.Saved.deleteOne({ user_id: userId, post_id: postId });
        res.status(200).json({ message: 'post unsaved successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'post unsaving failed' });
    }
});
exports.unsavePost = unsavePost;
const checkSaved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { postId } = req.body;
        const isSaved = yield savedModel_1.Saved.findOne({ user_id: userId, post_id: postId });
        if (isSaved) {
            res.status(200).json({ message: 'post saved checking successfull', saved: true });
        }
        else {
            res.status(200).json({ message: 'post saved checking successfull', saved: false });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'post saved checking failed' });
    }
});
exports.checkSaved = checkSaved;
const get_saved_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.userId) === null || _b === void 0 ? void 0 : _b.toString();
        const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
        const savedpostids = yield savedModel_1.Saved.aggregate([
            {
                $match: { user_id: userIdObject }
            },
            {
                $group: {
                    _id: null,
                    postIds: { $push: "$post_id" }
                }
            },
            {
                $project: {
                    postIds: 1
                }
            }
        ]);
        if (savedpostids[0]) {
            const allsavedposts = yield postModel_1.Post.aggregate([
                {
                    $match: { isDeleted: false, isHide: false, _id: { $in: [...savedpostids[0].postIds] } },
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
                {
                    $project: {
                        _id: 1,
                        post_image: 1,
                        likes: 1,
                        caption: 1,
                        "user.name": 1,
                        "user._id": 1,
                        "user.photo": 1,
                        createdAt: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ]);
            res.status(200).json(allsavedposts);
        }
        res.status(200);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'fetching saved posts failed' });
    }
});
exports.get_saved_posts = get_saved_posts;
