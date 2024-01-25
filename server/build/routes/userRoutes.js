"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthController_1 = require("../controllers/userControllers/userAuthController");
const userRouter = express_1.default.Router();
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const postControllers_1 = require("../controllers/userControllers/postControllers");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage
});
userRouter.post('/signup', userAuthController_1.create_user);
userRouter.post('/signupwithgoogle', userAuthController_1.create_google_user);
userRouter.post('/verifyotp', userAuthController_1.verifyOtp);
userRouter.post('/login', userAuthController_1.login_user);
userRouter.patch('/finishprofile', authMiddleware_1.protect, userAuthController_1.finishProfile);
userRouter.post('/addpost', authMiddleware_1.protect, postControllers_1.create_post);
userRouter.get('/getposts', authMiddleware_1.protect, postControllers_1.get_posts);
userRouter.get('/getuserdetails', authMiddleware_1.protect, userAuthController_1.get_user_details);
userRouter.post('/addcomment', authMiddleware_1.protect, postControllers_1.add_comment);
userRouter.patch('/editcomment', authMiddleware_1.protect, postControllers_1.edit_comment);
userRouter.post('/getcomments', authMiddleware_1.protect, postControllers_1.get_comments);
userRouter.patch('/likeunlike', authMiddleware_1.protect, postControllers_1.like_unlike);
userRouter.patch('/followunfollow', authMiddleware_1.protect, userAuthController_1.follow_unfollow);
userRouter.patch('/editprofile', authMiddleware_1.protect, userAuthController_1.edit_profile);
userRouter.patch('/deletepost', authMiddleware_1.protect, postControllers_1.delete_post);
userRouter.patch('/editpost', authMiddleware_1.protect, postControllers_1.edit_post);
userRouter.post('/reportpost', authMiddleware_1.protect, postControllers_1.report_post);
userRouter.post('/reportuser', authMiddleware_1.protect, userAuthController_1.report_user);
userRouter.get('/getuserblockstatus', authMiddleware_1.protect, userAuthController_1.get_user_block_status);
userRouter.get('/searchusers', authMiddleware_1.protect, userAuthController_1.searchUsers);
userRouter.get('/getallfollowings', authMiddleware_1.protect, userAuthController_1.get_followings);
userRouter.get('/getsuggestions', authMiddleware_1.protect, userAuthController_1.getSuggestions);
userRouter.get('/getnotifications', authMiddleware_1.protect, userAuthController_1.getNotifications);
userRouter.get('/getunreadnotifications', authMiddleware_1.protect, userAuthController_1.get_unread_notifications);
userRouter.patch('/clearunreadnotifications', authMiddleware_1.protect, userAuthController_1.clear_unread_notifications);
userRouter.post('/logout', userAuthController_1.logout);
exports.default = userRouter;
