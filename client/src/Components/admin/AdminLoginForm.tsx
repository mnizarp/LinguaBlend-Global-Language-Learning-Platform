import {Formik,Form,Field,ErrorMessage,FormikHelpers} from 'formik'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom"
import { useAdminLoginMutation } from '../../slices/adminApiSlice'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setAdminCredentials } from '../../slices/adminSlice'

const AdminLoginSchema=Yup.object().shape({
    email:Yup.string().email('Invalid email format').required('Email is required'),
    password:Yup.string().min(5,'Password must contain 5 characters minimum').required('Password is required')
})

interface FormValues{
    email:string,
    password:string
}

const AdminLoginForm:React.FC=()=>{
    const initialValues:FormValues={
        email:'',
        password:''
    }

    const navigate=useNavigate()
    const [login,{isLoading}]=useAdminLoginMutation()
    const dispatch=useDispatch()

    const handleSubmit=async(values:FormValues,{setSubmitting}:FormikHelpers<FormValues>)=>{
        try{
         setSubmitting(true)
         const {email,password}=values
        
        const response=await login({email,password}).unwrap()
        dispatch(setAdminCredentials({...response}))    
             navigate('/adminhome')          
        }catch(error:unknown){
            const apiError = error as  { status?: number } ;
          if(apiError?.status==402){
            toast.error('Invalid email or password')
          }else{
            toast.error('An error occured.Login failed')
          }
       
        }finally{
         setSubmitting(false)
        }
     }

    return(
        <>
        {
            isLoading ? 
            <div>
                <h1>Loading</h1>
            </div>
            :
        <Formik 
        initialValues={initialValues} 
        validationSchema={AdminLoginSchema} 
        onSubmit={handleSubmit} >
            {({isSubmitting})=>(
                <Form  className='w-full flex flex-col items-center justify-center space-y-8'>
                    <div className='w-[90%]' >
                    <Field type='email' name='email' placeholder='Enter email' className=' ps-3  placeholder:text-sm  border border-2-black  h-7 w-full rounded-2xl 
                                                                                           md:ps-6  md:h-9 md:w-full  ' />
                    <ErrorMessage component='div' name='email' className='text-red-600' />
                    </div>
                    <div className='w-[90%]'>
                    <Field type='password' name='password' placeholder='Enter password' className=' ps-3  placeholder:text-sm                  border border-2-black   h-7 w-full rounded-2xl 
                                                                                           md:ps-6  md:h-9 md:w-full' />
                    <ErrorMessage component='div' name='password' className='text-red-600' />
                    </div>
                    <button type='submit' disabled={isSubmitting} className='    text-sm   text-black h-6  w-max px-2  border-2 rounded-lg 
                                                                             md:h-9 ' >
                        {isSubmitting ? 'Please wait ...' : 'Login' }
                    </button>
                </Form>
            )}
        </Formik>
}
        </>
    )
}

export default AdminLoginForm