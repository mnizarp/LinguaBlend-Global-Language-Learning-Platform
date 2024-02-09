import { Request, Response, response } from "express";
import { Post } from "../../models/postModel";
import { Comment } from "../../models/commentModel";
import mongoose from "mongoose";
import { Report } from "../../models/reportModel";
import cloudinary from "../../utils/cloudinary";
import { Notification } from "../../models/notificationModel";
import { Saved } from "../../models/savedModel";


export const create_post = async (req: Request, res: Response) => {
  try {
    const { caption, userId, postImage } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(postImage, {
      upload_preset: "linguaBlend",
    });
    const newpost = new Post({
      user_id: userId,
      caption,
      post_image: uploadResponse.url,
      isHide: false,
      isDeleted: false,
    });

    await newpost.save();
    res.status(200).json({ message: "post added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "post adding failed" });
  }
};

export const get_posts = async (req: Request, res: Response) => {
  try {
    const userId = req.query?.userId as string;
    if (userId) {
      const userIdObject = new mongoose.Types.ObjectId(userId);
      const allposts = await Post.aggregate([
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
    } else {
      const allposts = await Post.aggregate([
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
  } catch (error) {
    console.error(error);
  }
};



export const add_comment = async (req: Request, res: Response) => {
  try {
    const { postId, userId, comment } = req.body;
    const newcomment = new Comment({
      user_id: userId,
      post_id: postId,
      comment,
    });
    await newcomment.save();
    res.status(200).json({ message: "comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "comment not added" });
  }
};

export const get_comments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const postIdObject = new mongoose.Types.ObjectId(postId);
    const allcomments = await Comment.aggregate([
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
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "failed fetching all comments" });
  }
};

export const like_unlike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const user = req.userId;
    const post = await Post.findOne({ _id: postId });
    const isAlreadyLiked = await Post.find({
      _id: postId,
      likes: { $in: [user] },
    });
    if (isAlreadyLiked.length > 0) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: user } });
      await Notification.deleteOne({
        user_id: post?.user_id,
        sender_id: user,
        type: "Like",
      });
      res.status(200).json({ liked: false, message: "unliked the post" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: user } });
      let newnotification;
      if(post?.user_id.toString() !== user ){
       newnotification = new Notification({
        user_id: post?.user_id,
        sender_id: user,
        type: "Like",
        unread: true,
      });
      await newnotification.save();
    }
      res.status(200).json({ liked: true, newnotification });
    }
  } catch (error) {
    console.error(error);
  }
};

export const delete_post = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    await Post.findByIdAndUpdate({ _id: postId }, { isDeleted: true });
    res.status(200).json({ message: "post deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "post deletion failed" });
  }
};

export const edit_post = async (req: Request, res: Response) => {
  try {
    const { postId, newCaption } = req.body;
    await Post.findByIdAndUpdate(
      { _id: postId },
      { $set: { caption: newCaption } }
    );
    res.status(200).json({ message: "caption updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "caption not updated" });
  }
};

export const report_post = async (req: Request, res: Response) => {
  try {
    const { postId, reportReason } = req.body;
    const reporterId = req.userId;
    const newreport = new Report({
      category: "post",
      reporter_id: reporterId,
      post_id: postId,
      report_reason: reportReason,
    });
    newreport.save();
    res.status(200).json({ message: "report submitted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "report failed" });
  }
};

export const edit_comment = async (req: Request, res: Response) => {
  try {
    const { editedComment, commentId } = req.body;
    await Comment.findByIdAndUpdate(commentId, {
      $set: { comment: editedComment },
    });
    res.status(200).json({ message: "comment edited" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "comment editing failed" });
  }
};

export const savePost=async(req:Request,res:Response)=>{
  try {
    const userId=req.userId
    const {postId}=req.body
    const newsavedpost= new Saved({
      post_id:postId,
      user_id:userId
    })
    await newsavedpost.save()
    res.status(200).json({message:'post saved successfully'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'post saving failed'})
  }
}

export const unsavePost=async(req:Request,res:Response)=>{
  try{
    const userId=req.userId
    const {postId}=req.body
    await Saved.deleteOne({user_id:userId,post_id:postId})
    res.status(200).json({message:'post unsaved successfully'})
  }catch(error){
    console.log(error)
    res.status(400).json({message:'post unsaving failed'})
  }
}

export const checkSaved=async(req:Request,res:Response)=>{
  try{
    const userId=req.userId
    const {postId}=req.body
   const isSaved= await Saved.findOne({user_id:userId,post_id:postId})
    if (isSaved) {
      res.status(200).json({message:'post saved checking successfull',saved:true})

    }else{
      res.status(200).json({message:'post saved checking successfull',saved:false})

    }
  }catch(error){
    console.log(error)
    res.status(400).json({message:'post saved checking failed'})
  }
}

export const get_saved_posts=async(req:Request,res:Response)=>{
  try {
    const userId=req.userId?.toString()

    const userIdObject = new mongoose.Types.ObjectId(userId);
  
    const savedpostids=await Saved.aggregate([
      {
        $match:{user_id:userIdObject}
      },
      {
        $group:{
          _id:null,
           postIds:{$push:"$post_id"}
        }
      },
      {
        $project:{
          postIds:1
        }
      }
    ]) 
       if(savedpostids[0]){
    const allsavedposts = await Post.aggregate([
      {
        $match: { isDeleted: false, isHide: false, _id:{$in:[...savedpostids[0].postIds]} },
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
    res.status(200).json(allsavedposts)
  }
  res.status(200)
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'fetching saved posts failed'})
  }
}