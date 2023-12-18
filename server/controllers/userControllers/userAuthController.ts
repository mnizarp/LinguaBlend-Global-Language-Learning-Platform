import { Request, Response } from "express";
import { User } from "../../models/userModel";
import { Country } from "../../models/countryModel";
import { Language } from "../../models/languageModel";
import generateToken from "../../utils/generateToken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Report } from "../../models/reportModel";
import otpGenerator from "otp-generator";
import generatePassword from "password-generator";
import nodemailer from "nodemailer";
import { Otp } from "../../models/otpModel";
import cloudinary from "../../utils/cloudinary";
import { Chat } from "../../models/chatModel";
import { Notification } from "../../models/notificationModel";

export const create_user = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (!userExists) {
      const newuser = new User({
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

      await newuser.save();
      const token = generateToken(newuser._id);

      const OTP = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const transporter = nodemailer.createTransport({
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
      transporter.sendMail(mailOptions, function (error, info) {});
      const otps = await Otp.findOne({ email: newuser.email });
      if (!otps) {
        const otp = new Otp({ email: newuser.email, otp: OTP });
        await otp.save();
      } else {
        await Otp.updateOne({ email: newuser.email }, { $set: { otp: OTP } });
      }

      res.status(200).json({
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        token,
      });
    } else if (userExists.isGoogleLogin == true) {
      res
        .status(402)
        .json({ message: "Already signed up with different Method" });
    } else {
      res.status(401).json({ message: "user already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

export const create_google_user = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const userExists = await User.findOne({ email });
    const randomPassword = generatePassword(8, false);
    if (!userExists) {
      const newuser = new User({
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

      await newuser.save();
      const token = generateToken(newuser._id);

      const transporter = nodemailer.createTransport({
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
        text:
          "USE THIS PASSWORD WHEN YOU LOGIN TO LINGUABLEND " + randomPassword,
      };
      transporter.sendMail(mailOptions, function (error, info) {});

      res.status(200).json({
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        isGoogleLogin: newuser.isGoogleLogin,
        token,
      });
    } else {
       if(userExists.isBlocked==true){
        res.status(403).json({message:'user got blocked by admin'})
       }
      const token = generateToken(userExists._id);
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
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const otpexists = await Otp.findOne({ email });
    if (otpexists) {
      if (otpexists.otp == otp) {
        await User.updateOne({ email }, { $set: { isVerified: true } });
        const userDetails = await User.findOne({ email });
        const token = generateToken(userDetails?._id);
        res.status(200).json({
          _id: userDetails?._id,
          name: userDetails?.name,
          email: userDetails?.email,
          token,
        });
      } else {
        res.status(402).json({ message: "incorrect otp" });
      }
    } else {
      res.status(403).json({ message: "otp not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "otp verification failed" });
  }
};

export const login_user = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPasswords(password))) {
      if (user.isBlocked == false) {
        const token = generateToken(user._id);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isProfileFinished: user.isProfileFinished,
          photo: user.photo,
          token,
        });
      } else {
        res.status(402).json({ message: "User is blocked by admin" });
      }
    } else {
      res.status(401).json({ message: "invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

export const finishProfile = async (req: Request, res: Response) => {
  try {
    const { language, country, userId, photo } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(photo, {
      upload_preset: "linguaBlend",
    });

    const countryInfo = await Country.findOne({ country });
    const languageInfo = await Language.findOne({ language });
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          country_id: countryInfo?._id,
          language_id: languageInfo?._id,
          photo: uploadResponse,
          isProfileFinished: true,
        },
      }
    );
    res.status(200).json({ photo: uploadResponse, isProfileFinished: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "profile not completed" });
  }
};

export const get_user_details = async (req: Request, res: Response) => {
  try {
    const userId = req.query?.userId as string;
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const userDetails = await User.aggregate([
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
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Logged out " });
  } catch (error) {
    console.log(error);
  }
};

export const follow_unfollow = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.body;
    const userId = req.userId;
    const isAlreadyFollowing = await User.find({
      _id: userId,
      following: { $in: [profileId] },
    });
    const isFollowingBack = await User.find({
      _id: userId,
      followers: { $in: [profileId] },
    });
    if (isAlreadyFollowing.length > 0) {
      await User.updateOne(
        { _id: userId },
        { $pull: { following: profileId } }
      );
      await User.updateOne(
        { _id: profileId },
        { $pull: { followers: userId } }
      );
      await Notification.deleteOne({
        user_id: profileId,
        sender_id: userId,
        type: "Follow",
      });
      res.status(200).json({ following: false, message: "unfollow updated" });
    } else {
      await User.updateOne(
        { _id: userId },
        { $push: { following: profileId } }
      );
      await User.updateOne(
        { _id: profileId },
        { $push: { followers: userId } }
      );
      const newnotification = new Notification({
        user_id: profileId,
        sender_id: userId,
        type: "Follow",
        unread: true,
      });
      await newnotification.save();

      if (isFollowingBack.length > 0) {
        const chat = await Chat.findOne({
          $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: profileId } } },
          ],
        });
        if (!chat) {
          const newchat = new Chat({
            users: [userId, profileId],
          });
          newchat.save();
        }
      }
      res.status(200).json({ following: true, newnotification });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "follow unfollow failed" });
  }
};

export const edit_profile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { photo,name, email, country, language, password } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(photo, {
      upload_preset: "linguaBlend",
    });
    if (photo) {
      await User.updateOne({ _id: userId }, { $set: { photo:uploadResponse } });
    }
    if (name) {
      await User.updateOne({ _id: userId }, { $set: { name } });
    }
    if (email) {
      await User.updateOne({ _id: userId }, { $set: { email } });
    }
    if (language) {
      await User.updateOne({ _id: userId }, { $set: { language } });
    }
    if (country) {
      await User.updateOne({ _id: userId }, { $set: { country } });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.updateOne(
        { _id: userId },
        { $set: { password: hashedPassword } }
      );
    }
    const updatedInfo = await User.findById(
      { _id: userId },
      { _id: 1, name: 1, email: 1, photo: 1, isProfileFinished: 1 }
    );
    res.status(200).json({ updatedInfo, message: "edited profile" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "edit profile failed" });
  }
};

export const report_user = async (req: Request, res: Response) => {
  try {
    const { userId, reportReason } = req.body;
    const reporterId = req.userId;
    const newreport = new Report({
      category: "user",
      reporter_id: reporterId,
      user_id: userId,
      report_reason: reportReason,
    });
    newreport.save();
    res.status(200).json({ message: "report submitted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "report failed" });
  }
};

export const get_user_block_status = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const blockstatus = await User.findById(userId, { isBlocked: 1 });
    res.status(200).json({ blockStatus: blockstatus?.isBlocked });
  } catch (error) {
    console.log("fetching failed");
    res.status(400).json({ message: "fetching user block status failed" });
  }
};

export const get_followings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allfollowings = await User.findById(userId, {
      following: 1,
    }).populate("following");
    res.status(200).json(allfollowings?.following);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "followings fetching failed" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const searchInput = req.query.search;
    const regex = new RegExp(searchInput as string, "i");
    const users = await User.find({
      name: { $regex: regex },
      isAdmin: false,
      isProfileFinished: true,
      isBlocked: false,
      _id: { $ne: req.userId },
    });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allsuggestions = await User.find({
      _id: { $ne: req.userId },
      isAdmin: false,
      isBlocked: false,
      isVerified: true,
      followers: { $nin: [userId] },
    }).populate("language_id");
    res.status(200).json({ allsuggestions });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "suggestions fetching failed" });
  }
};


export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate("sender_id");
    res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "notifications fetching failed" });
  }
};

export const get_unread_notifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const unreadnotifications = await Notification.find({
      user_id: userId,
      unread: true,
    });
    res.status(200).json({ unreadnotifications });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "unread notifications fetching failed" });
  }
};

export const clear_unread_notifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    await Notification.updateMany(
      { user_id: userId },
      { $set: { unread: false } }
    );
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "clearing failed" });
  }
};
