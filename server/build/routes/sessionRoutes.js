"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const sessionControllers_1 = require("../controllers/userControllers/sessionControllers");
exports.sessionRouter = (0, express_1.default)();
exports.sessionRouter.post('/createsession', authMiddleware_1.protect, sessionControllers_1.create_session);
exports.sessionRouter.get('/getsessions', authMiddleware_1.protect, sessionControllers_1.get_allsessions);
exports.sessionRouter.delete('/deletesession', authMiddleware_1.protect, sessionControllers_1.delete_session);
exports.sessionRouter.patch('/joinsession', authMiddleware_1.protect, sessionControllers_1.join_session);
exports.sessionRouter.patch('/leavesession', authMiddleware_1.protect, sessionControllers_1.leave_session);
exports.sessionRouter.post('/sendsessionmessage', authMiddleware_1.protect, sessionControllers_1.sendSessionMessage);
exports.sessionRouter.post('/getsessionmessages', authMiddleware_1.protect, sessionControllers_1.getSessionMessages);
exports.sessionRouter.post('/getsessionmembers', authMiddleware_1.protect, sessionControllers_1.getSessionMembers);
