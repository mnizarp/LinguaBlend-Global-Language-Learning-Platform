import express from 'express'
import { clear_unread_notifications, create_google_user, create_user,edit_profile,finishProfile,follow_unfollow,getNotifications,getSuggestions,get_followings,get_unread_notifications,get_user_block_status,get_user_details,login_user, logout, report_user, searchUsers, verifyOtp } from '../controllers/userControllers/userAuthController'

const userRouter=express.Router()
import { protect } from '../middlewares/authMiddleware'
import multer from 'multer'
import path from 'path'
import { create_post, get_posts,add_comment, get_comments, like_unlike, delete_post, edit_post, report_post, edit_comment } from '../controllers/userControllers/postControllers'

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

userRouter.post('/signup',create_user)
userRouter.post('/signupwithgoogle',create_google_user)
userRouter.post('/verifyotp',verifyOtp)
userRouter.post('/login',login_user)
userRouter.patch('/finishprofile',protect,finishProfile)
userRouter.post('/addpost',protect,create_post)
userRouter.get('/getposts',protect,get_posts)
userRouter.get('/getuserdetails',protect,get_user_details)
userRouter.post('/addcomment',protect,add_comment)
userRouter.patch('/editcomment',protect,edit_comment)
userRouter.post('/getcomments',protect,get_comments)
userRouter.patch('/likeunlike',protect,like_unlike)
userRouter.patch('/followunfollow',protect,follow_unfollow)
userRouter.patch('/editprofile',protect,edit_profile)
userRouter.patch('/deletepost',protect,delete_post)
userRouter.patch('/editpost',protect,edit_post)
userRouter.post('/reportpost',protect,report_post)
userRouter.post('/reportuser',protect,report_user)
userRouter.get('/getuserblockstatus',protect,get_user_block_status)
userRouter.get('/searchusers',protect,searchUsers)
userRouter.get('/getallfollowings',protect,get_followings)
userRouter.get('/getsuggestions',protect,getSuggestions)
userRouter.get('/getnotifications',protect,getNotifications)
userRouter.get('/getunreadnotifications',protect,get_unread_notifications)
userRouter.patch('/clearunreadnotifications',protect,clear_unread_notifications)
userRouter.post('/logout',logout)
export default userRouter