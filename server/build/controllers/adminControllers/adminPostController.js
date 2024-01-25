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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_trending_posts = exports.post_hide_unhide = exports.get_user_posts = exports.get_post_reports = void 0;
const reportModel_1 = require("../../models/reportModel");
const postModel_1 = require("../../models/postModel");
const get_post_reports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allpostreports = yield reportModel_1.Report.aggregate([
            {
                $match: { category: "post" },
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
                    from: "posts",
                    localField: "post_id",
                    foreignField: "_id",
                    as: "post",
                },
            },
            {
                $unwind: "$post",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post.user_id",
                    foreignField: "_id",
                    as: "posteduser",
                },
            },
            {
                $unwind: "$posteduser",
            },
            {
                $match: { "post.isDeleted": false },
            },
        ]);
        res.status(200).json({ allpostreports });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "failed fetching all postreports" });
    }
});
exports.get_post_reports = get_post_reports;
const get_user_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        const userposts = yield postModel_1.Post.find({ user_id: userId, isDeleted: false });
        res.status(200).json({ userposts });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "user posts fetching failed" });
    }
});
exports.get_user_posts = get_user_posts;
const post_hide_unhide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        yield postModel_1.Post.findByIdAndUpdate({ _id: postId }, [
            {
                $set: {
                    isHide: {
                        $cond: {
                            if: { $eq: ["$isHide", true] },
                            then: false,
                            else: true,
                        },
                    },
                },
            },
        ]);
        res.status(200).json({ message: "Hide update done" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Hide update failed" });
    }
});
exports.post_hide_unhide = post_hide_unhide;
const get_trending_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trendingposts = yield postModel_1.Post.aggregate([
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
                    likesCount: { $size: "$likes" },
                },
            },
            {
                $sort: { likesCount: -1 },
            },
            {
                $limit: 3,
            },
        ]);
        res.status(200).json({ trendingposts });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "trending posts fetching failed" });
    }
});
exports.get_trending_posts = get_trending_posts;
