import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
        trim:true
    },
    chat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chats'
    },
    unread:{
        type:Boolean
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

export const Message=mongoose.model('messages',messageSchema)