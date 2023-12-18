import express from 'express'
import { adminLogin, getAllPosts, get_new_users, get_user_details, get_user_reports, get_users, getsessions, user_block_unblock } from '../controllers/adminControllers/adminAuthController'
import { addNewLanguage, getLanguages, language_list_unlist } from '../controllers/adminControllers/languageController'
const adminRouter=express.Router()
import multer from 'multer'
import path from 'path'
import { addNewCountry, country_list_unlist, getCountries } from '../controllers/adminControllers/countryController'
import { get_post_reports, get_trending_posts, get_user_posts, post_hide_unhide } from '../controllers/adminControllers/adminPostController'
import { adminProtect } from '../middlewares/adminAuthMiddleware'

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname, '../public/images'))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage
})

adminRouter.post('/login',adminLogin)
adminRouter.post('/addnewlanguage',upload.single('flag'),addNewLanguage)
adminRouter.post('/addnewcountry',upload.single('flag'),addNewCountry)
adminRouter.get('/getusers',adminProtect,get_users)
adminRouter.get('/getlanguages',getLanguages)
adminRouter.get('/getcountries',getCountries)
adminRouter.patch('/userblockupdate',adminProtect,user_block_unblock)
adminRouter.patch('/languagelistupdate',adminProtect,language_list_unlist)
adminRouter.patch('/countrylistupdate',adminProtect,country_list_unlist)
adminRouter.get('/getpostreports',adminProtect,get_post_reports)
adminRouter.get('/getuserreports',adminProtect,get_user_reports)
adminRouter.get('/getuserdetails',adminProtect,get_user_details)
adminRouter.get('/getuserposts',adminProtect,get_user_posts)
adminRouter.patch('/posthideupdate',adminProtect,post_hide_unhide)
adminRouter.get('/gettrendingposts',adminProtect,get_trending_posts)
adminRouter.get('/getnewusers',adminProtect,get_new_users)
adminRouter.get('/getsessions',adminProtect,getsessions)
adminRouter.get('/getallposts',adminProtect,getAllPosts)
export default adminRouter

