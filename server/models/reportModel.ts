import mongoose from 'mongoose'

const reportSchema=new mongoose.Schema({
    reporter_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    category:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    },
    report_reason:{
        type:String,
        required:true
    }
},
{
    timestamps:true
})

export const Report=mongoose.model('reports',reportSchema)