import mongoose,{ Document }  from "mongoose";

interface CountryModel extends Document{
    country:string,
    flag:string,
    list:boolean
}

const countrySchema= new mongoose.Schema({
    country:{
        type:String,
        required:true
    },
    flag:{
        type:String,
        required:true
    },
    list:{
        type:Boolean,
        required:true
    }
})

export const Country=mongoose.model<CountryModel>('countries',countrySchema)
