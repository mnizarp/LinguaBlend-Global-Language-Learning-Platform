import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        sender_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        type:{
            type:String,
        },
        unread:{
            type:Boolean
        }
     },{
        timestamps:true
     }
)

export const Notification=mongoose.model('notifications',notificationSchema)