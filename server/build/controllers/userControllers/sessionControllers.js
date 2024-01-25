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
exports.getSessionMembers = exports.getSessionMessages = exports.sendSessionMessage = exports.leave_session = exports.join_session = exports.delete_session = exports.get_allsessions = exports.create_session = void 0;
const languageModel_1 = require("../../models/languageModel");
const sessionModel_1 = require("../../models/sessionModel");
const sessionMessageModel_1 = require("../../models/sessionMessageModel");
const create_session = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { language, difficulty, title } = req.body;
        const host = req.userId;
        const languageInfo = yield languageModel_1.Language.findOne({ language });
        const newsession = new sessionModel_1.Session({
            title,
            language: languageInfo === null || languageInfo === void 0 ? void 0 : languageInfo._id,
            difficulty,
            host,
        });
        yield newsession.save();
        const populatedSession = yield sessionModel_1.Session.populate(newsession, {
            path: "language",
            select: "language flag",
        });
        res.status(200).json({ newsession });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "session creation failed" });
    }
});
exports.create_session = create_session;
const get_allsessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allsessions = yield sessionModel_1.Session.find({
            host: { $ne: req.userId },
        }).populate("language");
        res.status(200).json({ allsessions });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "sessions fetching failed" });
    }
});
exports.get_allsessions = get_allsessions;
const delete_session = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = req.userId;
        const session = yield sessionModel_1.Session.findOne({ host });
        yield sessionModel_1.Session.deleteOne({ host });
        yield sessionMessageModel_1.SessionMessage.deleteMany({ session_id: session === null || session === void 0 ? void 0 : session._id });
        res.status(200).json({ message: "session deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "session deleting failed" });
    }
});
exports.delete_session = delete_session;
const join_session = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        const member = req.userId;
        yield sessionModel_1.Session.updateOne({ _id: sessionId }, { $push: { members: member } });
        const sessiondetails = yield sessionModel_1.Session.findOne({ _id: sessionId }).populate("language");
        res.status(200).json({ sessiondetails });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "joined session failed" });
    }
});
exports.join_session = join_session;
const leave_session = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        const member = req.userId;
        yield sessionModel_1.Session.updateOne({ _id: sessionId }, { $pull: { members: member } });
        res.status(200).json({ message: "left from session" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "leave from session failed" });
    }
});
exports.leave_session = leave_session;
const sendSessionMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, sessionId } = req.body;
        const sender_id = req.userId;
        const newsessionmessage = new sessionMessageModel_1.SessionMessage({
            sender_id,
            content: message,
            session_id: sessionId,
        });
        yield newsessionmessage.save();
        const sessionmessage = yield sessionMessageModel_1.SessionMessage.findById(newsessionmessage._id)
            .populate("session_id")
            .populate("sender_id");
        res.status(200).json({ sessionmessage });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "message sending failed" });
    }
});
exports.sendSessionMessage = sendSessionMessage;
const getSessionMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        const sessionmessages = yield sessionMessageModel_1.SessionMessage.find({ session_id: sessionId })
            .populate("sender_id")
            .sort({ createdAt: -1 });
        res.status(200).json({ sessionmessages });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "messages fetching failed" });
    }
});
exports.getSessionMessages = getSessionMessages;
const getSessionMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        const allmembers = yield sessionModel_1.Session.find({ _id: sessionId }, { members: 1, host: 1 })
            .populate("members")
            .populate("host");
        res.status(200).json({ allmembers });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "members fetching failed" });
    }
});
exports.getSessionMembers = getSessionMembers;
