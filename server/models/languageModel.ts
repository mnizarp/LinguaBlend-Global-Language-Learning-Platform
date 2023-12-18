import mongoose,{ Document }  from "mongoose";

interface LanguageModel extends Document{
    language:string,
    flag:string,
    list:boolean
}

const languageSchema= new mongoose.Schema({
    language:{
        type:String,
        required:true
    },
    flag:{
        type:String,
        
    },
    list:{
        type:Boolean,
        required:true
    }
})

export const Language=mongoose.model<LanguageModel>('languages',languageSchema)