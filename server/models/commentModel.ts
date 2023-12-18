import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},
{
   timestamps:true 
})

export const Comment=mongoose.model('comments',commentSchema)