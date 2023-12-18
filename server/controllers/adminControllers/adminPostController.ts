import { Request, Response } from "express";
import { Report } from "../../models/reportModel";
import { Post } from "../../models/postModel";


export const get_post_reports = async (req: Request, res: Response) => {
  try {
    const allpostreports = await Report.aggregate([
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed fetching all postreports" });
  }
};

export const get_user_posts = async (req: Request, res: Response) => {
  try {
    const userId = req.query?.userId;
    const userposts = await Post.find({ user_id: userId, isDeleted: false });
    res.status(200).json({ userposts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "user posts fetching failed" });
  }
};

export const post_hide_unhide = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    await Post.findByIdAndUpdate({ _id: postId }, [
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Hide update failed" });
  }
};

export const get_trending_posts = async (req: Request, res: Response) => {
  try {
    const trendingposts = await Post.aggregate([
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "trending posts fetching failed" });
  }
};
