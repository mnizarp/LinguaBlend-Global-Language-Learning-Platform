import { Request, Response } from "express";
import { Chat } from "../../models/chatModel";
import { Message } from "../../models/messageModel";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const sender = req.userId;
    const reciever = req.body.recieverId;
    const content = req.body.message;

    const chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: sender } } },
        { users: { $elemMatch: { $eq: reciever } } },
      ],
    });
    if (chat) {
      try {
        const newmessage = new Message({
          sender_id: sender,
          content,
          chat_id: chat._id,
          unread:true,
          user_id:reciever
        });
        newmessage.save();
        await Chat.findByIdAndUpdate(
          { _id: chat._id },
          { $set: { latest_message: newmessage._id } }
        );
        const messagedata = await Message.findById(newmessage._id).populate(
          "chat_id"
        );
        res.status(200).json({ message: messagedata });
      } catch (error) {
        console.log(error);
      }
    } else {
      const newchat = new Chat({
        users: [sender, reciever],
      });
      newchat.save();
      try {
        const newmessage = new Message({
          sender_id: sender,
          content,
          chat_id: newchat._id,
          unread:true,
          user_id:reciever
        });
        newmessage.save();
        await Chat.findByIdAndUpdate(
          { _id: newchat._id },
          { $set: { latest_message: newmessage._id } }
        );
        const messagedata = await Message.findById(newmessage._id).populate(
          "chat_id"
        );
        res.status(200).json({ message: messagedata });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Message sending failed" });
  }
};

export const get_messages = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const {secondUserId} = req.body
    const chat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: secondUserId } } },
      ],
    });

    const allmessages = await Message.find({ chat_id: chat?._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ allmessages, chatId: chat?._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "messages fetching failed" });
  }
};

export const get_chats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const allchats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate({
        path: "users",
        match: { _id: { $ne: userId } },
      })
      .populate("latest_message");
    res.status(200).json(allchats);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "chats fetching failed" });
  }
};



export const get_unread_messages = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const unreadmessages = await Message.find({
      user_id: userId,
      unread: true,
    });
    res.status(200).json({ unreadmessages });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "unread messages fetching failed" });
  }
};

export const get_chat_unread_messages=async(req:Request,res:Response)=>{
  try{
    const userId=req.userId
    const {chatId}=req.body
    const chatunreadmessages=await Message.find({
      user_id:userId,
      chat_id:chatId,
      unread:true
    })
    res.status(200).json({chatunreadmessages})
  }catch(error){
    console.log(error)
    res.status(400).json({message:'chat unread messages fetching failed'})
  }
}

export const clear_unread_messages = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const {chatId} = req.body

    await Message.updateMany(
      { user_id: userId,chat_id:chatId },
      { $set: { unread: false } }
    );
    res.status(200).json({ message: "Ok" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "clearing failed" });
  }
};