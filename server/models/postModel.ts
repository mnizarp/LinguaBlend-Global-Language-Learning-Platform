import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    post_image:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    comments:{
        type:Array,
    },
    likes:{
        type:Array,
    },  
    isHide:{
        type:Boolean,
        required:true
    },
    isDeleted:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
})

export const Post=mongoose.model('posts',postSchema)