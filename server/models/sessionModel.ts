import mongoose from "mongoose";

const sessionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    language:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'languages'
    },
    difficulty:{
        type:String,
        required:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
     ],
},
{
    timestamps:true
})

export const Session=mongoose.model('sessions',sessionSchema)