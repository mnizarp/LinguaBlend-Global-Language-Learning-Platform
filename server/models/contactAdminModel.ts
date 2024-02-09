import mongoose from 'mongoose'

const contactAdminSchema=new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    user_email:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const ContactAdmin=mongoose.model('contact_admin',contactAdminSchema)