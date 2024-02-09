import { Formik,Form,Field,ErrorMessage,FormikHelpers } from "formik"
import * as Yup from 'yup'
import { useSignupMutation } from "../../slices/usersApiSlice"
import toast, { Toaster } from "react-hot-toast"
import React from "react"

const SignupSchema=Yup.object().shape({
    name:Yup.string()
    .matches(/^[A-Za-z]+$/, 'Name should only contain letters')
    .required('Name field is required')
    .min(5,'Must contain minimum 5 characters'),
    email:Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
    password:Yup.string()
    .required('Password is required')
    .test(
        'at-least-three-letters',
        'Password should contain at least 3 letters',
        (value) => {
          const letterCount = (value.match(/[A-Za-z]/g) || []).length;
          return letterCount >= 3;
        }
      )
      .matches(
        /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
        'Password should contain at least one special character'
    )
    .min(5,'Password must contain 5 characters'),
    confirmPassword:Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')]  ,'Password must match')
}) 

interface FormValues{
    name:string,
    email:string,
    password:string,
    confirmPassword:string
}

interface SignupFormProps{
    setVerifyPending:React.Dispatch<React.SetStateAction<boolean>>
    setEmail:React.Dispatch<React.SetStateAction<string>>
}

const SignupForm:React.FC<SignupFormProps>=({setVerifyPending,setEmail})=>{
    const initialValues:FormValues={
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    }
    const [signup]=useSignupMutation()


    const handleSubmit=async(values:FormValues,{setSubmitting}:FormikHelpers<FormValues>)=>{
       try{
        setSubmitting(true)
        const {name,email,password}=values
        await signup({name,email,password}).unwrap()
        setEmail(email)
        setVerifyPending(true)
       }catch(error:unknown){
         const apiError = error as  { status?: number } ;
         if(apiError.status==401){
            toast.error('User Already Exists')
         }else{
            toast.error('User Registeration failed')
         }
       }finally{
        setSubmitting(false)
       }
    }

    return(
        <>
        <Toaster/>
    <Formik 
    initialValues={initialValues}
    validationSchema={SignupSchema}
    onSubmit={handleSubmit}
    >
     {({isSubmitting})=>(
        <Form className="w-full flex flex-col  items-center space-y-4  ">
            <div className="w-[90%] md:w-[60%]">
            <Field type='text' name='name' placeholder='Enter your name' className='ps-3 placeholder:text-white placeholder:text-xs text-white border border-2-white   h-8 w-full rounded-xl bg-slate-100 bg-opacity-25 
                                                                                    md:h-10  md:placeholder:text-sm' />
            <ErrorMessage component='div' name='name' className='text-red-400 text-xs'/>
            </div>
            <div className="w-[90%] md:w-[60%]">
            <Field type='email' name='email' placeholder='Enter your email' className=' ps-3 placeholder:text-white placeholder:text-xs text-white border border-2-white   h-8 w-full rounded-xl bg-slate-100 bg-opacity-25 
                                                                                       md:h-10 md:placeholder:text-sm'/>
            <ErrorMessage component='div' name='email' className='text-red-400 text-xs'/>
            </div>
            <div className="w-[90%] md:w-[60%]">
            <Field type='password' name='password' placeholder='Enter password' className=' ps-3 placeholder:text-white placeholder:text-xs text-white border border-2-white   h-8 w-full rounded-xl bg-slate-100 bg-opacity-25 
                                                                                            md:h-10 md:placeholder:text-sm'/>
            <ErrorMessage component='div' name='password' className='text-red-400 text-xs'/>
            </div>
            <div className="w-[90%] md:w-[60%] ">
            <Field type='password' name='confirmPassword' placeholder='Enter password again' className=' ps-3 placeholder:text-white placeholder:text-xs text-white border border-2-white   h-8 w-full rounded-xl bg-slate-100 bg-opacity-25 
                                                                                                         md:h-10 md:placeholder:text-sm'/>
            <ErrorMessage component='div' name='confirmPassword' className='text-red-400 text-xs'/>
            </div>
            <button type="submit" disabled={isSubmitting} className="border-2  bg-emerald-300  text-white h-7 text-xs p-1 w-max bg-opacity-60 rounded-lg
                                                                     md:h-10 md:text-sm">
                {isSubmitting ? 'Please wait...':'Signup'}
            </button>            
        </Form>
     )}   

    </Formik>
    </>
    )
}
export default SignupForm