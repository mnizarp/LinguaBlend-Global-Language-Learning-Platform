import mongoose from "mongoose";

const chatSchema=new mongoose.Schema({
     users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
     ],
     latest_message:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'messages'
     }

},
{
    timestamps:true
})

export const Chat=mongoose.model('chats',chatSchema)