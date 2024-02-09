import mongoose from 'mongoose'

const savedSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    }
})

export const Saved=mongoose.model('saved',savedSchema)