import mongoose from 'mongoose'

const sessionMessageSchema=new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
        trim:true
    },
    session_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sessions'
    }
},{
    timestamps:true
})

export const SessionMessage=mongoose.model('sessionmessages',sessionMessageSchema)