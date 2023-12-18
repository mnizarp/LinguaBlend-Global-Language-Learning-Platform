import mongoose,{Document} from "mongoose";
import bcrypt from 'bcryptjs'


interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isBlocked: boolean;
    isProfileFinished:boolean,
    following: any[];
    followers: any[];
    language_id:any;
    country_id:any;
    photo:string;
    registered_on: string;
    isGoogleLogin:boolean;
    isVerified:boolean;
    matchPasswords(enteredPassword: string): Promise<boolean>;
}

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    isBlocked:{
        type:Boolean,
        required:true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    language_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'languages'
    },
    country_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'countries'
    },
    photo:{
        type:Object
    },
    isProfileFinished:{
       type:Boolean,
       required:true
    },
    registered_on:{
        type:String,
        required:true
    },   
    isGoogleLogin:{
        type:Boolean,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true
    },
},
{
    timestamps:true
}
)


    userSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            next()
        }
        if(this.password){
            const salt=await bcrypt.genSalt(10)
            this.password=await bcrypt.hash(this.password,salt)
        }
        next()    
    })



userSchema.methods.matchPasswords=async function(enteredPassword:string){
   return await bcrypt.compare(enteredPassword,this.password)
}

export const User=mongoose.model<IUser>('user',userSchema)