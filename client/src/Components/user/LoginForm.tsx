import {Formik,Form,Field,ErrorMessage,FormikHelpers} from 'formik'
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup'
import { setCredentials } from "../../slices/authSlice"
import { useDispatch } from "react-redux"
import { useLoginMutation } from '../../slices/usersApiSlice'

const LoginSchema=Yup.object().shape({
    email:Yup.string().email('Invalid email format').required('Email is required'),
    password:Yup.string().min(5,'Password must contain 5 characters minimum').required('Password is required')
})

interface FormValues{
    email:string,
    password:string
}

interface LoginFormProps{
    setContactAdminOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm:React.FC<LoginFormProps>=({setContactAdminOpen})=>{
    const initialValues:FormValues={
        email:'',
        password:''
    }
    const [login]=useLoginMutation()
    const dispatch=useDispatch()

    const handleSubmit=async(values:FormValues,{setSubmitting}:FormikHelpers<FormValues>)=>{
        try{
         setSubmitting(true)
         const {email,password}=values
         const response=await login({email,password}).unwrap()                  
                dispatch(setCredentials({...response}))                                         
        }catch(error:unknown ){
            const apiError = error as  { status?: number } ;
            if(apiError?.status===402){
                toast.error('Account is blocked by Admin')
                setContactAdminOpen(true)
            }else if(apiError?.status===401){
                toast.error('Invalid Email or Password')
            }else{
                toast.error('Login failed.Try again')
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
        validationSchema={LoginSchema} 
        onSubmit={handleSubmit} >
            {({isSubmitting})=>(
                <Form  className='w-full flex flex-col items-center justify-center space-y-2 '>
                    <div className='w-full md:w-[90%]' >
                    <Field type='email' name='email' placeholder='Enter email' className=' ps-3 placeholder:text-white placeholder:text-sm text-white border border-2-white  h-7 w-full rounded-2xl bg-slate-100 bg-opacity-25 
                                                                                           md:ps-6  md:h-9 md:w-full  ' />
                    <ErrorMessage component='div' name='email' className='text-red-600' />
                    </div>
                    <div className='w-full md:w-[90%]'>
                    <Field type='password' name='password' placeholder='Enter password' className=' ps-3 placeholder:text-white placeholder:text-sm text-white border border-2-white   h-7 w-full rounded-2xl bg-slate-100 bg-opacity-25 
                                                                                           md:ps-6  md:h-9 md:w-full' />
                    <ErrorMessage component='div' name='password' className='text-red-600' />
                    </div>
                    <button type='submit' disabled={isSubmitting} className='  bg-emerald-300  text-sm   text-white h-6  w-max px-2  bg-opacity-60 rounded-lg 
                                                                             md:h-9 ' >
                        {isSubmitting ? 'Please wait ...' : 'Login' }
                    </button>
                </Form>
            )}
        </Formik>
        </>
    )
}

export default LoginForm