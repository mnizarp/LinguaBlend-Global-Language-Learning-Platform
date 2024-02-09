import { Request, Response } from "express";
import { User } from "../../models/userModel";
import mongoose from "mongoose";
import { Report } from "../../models/reportModel";
import { Session } from "../../models/sessionModel";
import { Post } from "../../models/postModel";
import generateToken from "../../utils/generateToken";
import { ContactAdmin } from "../../models/contactAdminModel";
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, isAdmin: true });
    if (admin && (await admin.matchPasswords(password))) {
      const token = generateToken(admin._id);
      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      });
    } else {
      res.status(402).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(400);
    console.log("admin login failed");
  }
};

export const get_users = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.aggregate([
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "getting users failed" });
  }
};

export const user_block_unblock = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const userIdObject = new mongoose.Types.ObjectId(userId);
    await User.findByIdAndUpdate({ _id: userId }, [
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "block update failed" });
  }
};

export const get_user_reports = async (req: Request, res: Response) => {
  try {
    const alluserreports = await Report.aggregate([
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed fetching all userreports" });
  }
};

export const get_user_details = async (req: Request, res: Response) => {
  try {
    const userId = req.query?.userId;
    const userdetails = await User.findById(userId)
      .populate("country_id")
      .populate("language_id")
      .select("-password");
    res.status(200).json({ userdetails });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "userdetails fetching failed" });
  }
};

export const get_new_users = async (req: Request, res: Response) => {
  try {
    const newusers = await User.find({
      isAdmin: false,
      isBlocked: false,
      isProfileFinished: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ newusers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "new users fetching failed" });
  }
};

export const getsessions = async (req: Request, res: Response) => {
  try {
    const allsessions = await Session.find({}).populate("language");
    res.status(200).json({ allsessions });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "sessions fetching failed" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allposts = await Post.find({ isDeleted: false, isHide: false });
    res.status(200).json({ allposts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "all posts fetching failed" });
  }
};


export const getAdminContacts=async(req:Request,res:Response)=>{
  try{
    const admincontacts=await ContactAdmin.find({}).sort({createdAt:-1})
    res.status(200).json(admincontacts)
  }catch(error){
    console.log(error)
    res.status(400).json({message:'admin contacts fetching failed'})
  }
}