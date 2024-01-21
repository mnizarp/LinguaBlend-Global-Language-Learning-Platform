import { Request, Response } from "express";
import { Language } from "../../models/languageModel";
import { Session } from "../../models/sessionModel";
import { SessionMessage } from "../../models/sessionMessageModel";

export const create_session = async (req: Request, res: Response) => {
  try {
    const { language, difficulty, title } = req.body;
    const host = req.userId;
    const languageInfo = await Language.findOne({ language });
    const newsession = new Session({
      title,
      language: languageInfo?._id,
      difficulty,
      host,
    });
    await newsession.save();

    const populatedSession = await Session.populate(newsession, {
      path: "language",
      select: "language flag",
    });

    res.status(200).json({ newsession });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "session creation failed" });
  }
};

export const get_allsessions = async (req: Request, res: Response) => {
  try {
    const allsessions = await Session.find({
      host: { $ne: req.userId },
    }).populate("language");
    res.status(200).json({ allsessions });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "sessions fetching failed" });
  }
};

export const delete_session = async (req: Request, res: Response) => {
  try {

    const host = req.userId;
    const session = await Session.findOne({ host });
    await Session.deleteOne({ host });
    await SessionMessage.deleteMany({ session_id: session?._id });

    res.status(200).json({ message: "session deleted" });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "session deleting failed" });
  }
};

export const join_session = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const member = req.userId;
    await Session.updateOne({ _id: sessionId }, { $push: { members: member } });
    const sessiondetails = await Session.findOne({ _id: sessionId }).populate(
      "language"
    );
    res.status(200).json({ sessiondetails });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "joined session failed" });
  }
};

export const leave_session = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const member = req.userId;
    await Session.updateOne({ _id: sessionId }, { $pull: { members: member } });
    res.status(200).json({ message: "left from session" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "leave from session failed" });
  }
};

export const sendSessionMessage = async (req: Request, res: Response) => {
  try {
    
    const { message, sessionId } = req.body;
    const sender_id = req.userId;
    const newsessionmessage = new SessionMessage({
      sender_id,
      content: message,
      session_id: sessionId,
    });
    await newsessionmessage.save();
    const sessionmessage = await SessionMessage.findById(newsessionmessage._id)
      .populate("session_id")
      .populate("sender_id");
    res.status(200).json({ sessionmessage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "message sending failed" });
  }
};

export const getSessionMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const sessionmessages = await SessionMessage.find({ session_id: sessionId })
      .populate("sender_id")
      .sort({ createdAt: -1 });
    res.status(200).json({ sessionmessages });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "messages fetching failed" });
  }
};

export const getSessionMembers = async (req: Request, res: Response) => {
  try {
   
    const { sessionId } = req.body;
    const allmembers = await Session.find(
      { _id: sessionId },
      { members: 1, host: 1 }
    )
      .populate("members")
      .populate("host");
    res.status(200).json({ allmembers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "members fetching failed" });
  }
};
