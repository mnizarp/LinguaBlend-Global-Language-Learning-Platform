import jwt from 'jsonwebtoken'
import { Response } from 'express'
import mongoose from 'mongoose'

const generateToken=(userId:mongoose.Types.ObjectId)=>{
   const token=jwt.sign({userId},process.env.JWT_SECRET_KEY as string,{
    expiresIn:'30d'
   })

   return token
   
   // res.cookie('jwt',token,{
   //  httpOnly:true,
   //  sameSite:'strict',
   //  secure:false,
   //  maxAge:30*24*60*60*1000
   // })
}
export default generateToken