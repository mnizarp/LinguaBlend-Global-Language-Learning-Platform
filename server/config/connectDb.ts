import mongoose from "mongoose";

const connectDb=async()=>{
    try{
      await mongoose.connect(process.env.MONGO_URI as string)
      console.log('mongodb connected successfully')   
    }catch(error){
        console.log('mongodb connection failed')
    }
}

export default connectDb
