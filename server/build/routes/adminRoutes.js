"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = require("../controllers/adminControllers/adminAuthController");
const languageController_1 = require("../controllers/adminControllers/languageController");
const adminRouter = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const countryController_1 = require("../controllers/adminControllers/countryController");
const adminPostController_1 = require("../controllers/adminControllers/adminPostController");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
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
adminRouter.post('/login', adminAuthController_1.adminLogin);
adminRouter.post('/addnewlanguage', upload.single('flag'), languageController_1.addNewLanguage);
adminRouter.post('/addnewcountry', upload.single('flag'), countryController_1.addNewCountry);
adminRouter.get('/getusers', adminAuthMiddleware_1.adminProtect, adminAuthController_1.get_users);
adminRouter.get('/getlanguages', languageController_1.getLanguages);
adminRouter.get('/getcountries', countryController_1.getCountries);
adminRouter.patch('/userblockupdate', adminAuthMiddleware_1.adminProtect, adminAuthController_1.user_block_unblock);
adminRouter.patch('/languagelistupdate', adminAuthMiddleware_1.adminProtect, languageController_1.language_list_unlist);
adminRouter.patch('/countrylistupdate', adminAuthMiddleware_1.adminProtect, countryController_1.country_list_unlist);
adminRouter.get('/getpostreports', adminAuthMiddleware_1.adminProtect, adminPostController_1.get_post_reports);
adminRouter.get('/getuserreports', adminAuthMiddleware_1.adminProtect, adminAuthController_1.get_user_reports);
adminRouter.get('/getuserdetails', adminAuthMiddleware_1.adminProtect, adminAuthController_1.get_user_details);
adminRouter.get('/getuserposts', adminAuthMiddleware_1.adminProtect, adminPostController_1.get_user_posts);
adminRouter.patch('/posthideupdate', adminAuthMiddleware_1.adminProtect, adminPostController_1.post_hide_unhide);
adminRouter.get('/gettrendingposts', adminAuthMiddleware_1.adminProtect, adminPostController_1.get_trending_posts);
adminRouter.get('/getnewusers', adminAuthMiddleware_1.adminProtect, adminAuthController_1.get_new_users);
adminRouter.get('/getsessions', adminAuthMiddleware_1.adminProtect, adminAuthController_1.getsessions);
adminRouter.get('/getallposts', adminAuthMiddleware_1.adminProtect, adminAuthController_1.getAllPosts);
exports.default = adminRouter;
