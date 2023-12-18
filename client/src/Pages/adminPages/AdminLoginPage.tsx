import { Toaster } from "react-hot-toast"
import AdminLoginForm from "../../Components/admin/AdminLoginForm"

const AdminLoginPage:React.FC=()=>{
    return(
         <div className="w-screen h-screen p-3">
            <Toaster/>
             <div className="container w-full h-full flex flex-col md:px-5 md:flex-row justify-center items-center">
                 <div className="flex flex-col items-center md:w-[50%]">
                    <img className="w-[35%] md:w-[20%] h-[50%] md:h-[30%]" src="/assets/lb-removebg-previewhh.png" alt=""/>
                    <img className="w-[60%] md:w-[40%] h-[30%] md:h-[20%]" src="/assets/lb-removebg-preview.png" alt=""/>                  
                 </div>
                 <div className="w-full md:w-[50%] md:h-[50%] border border-black border-opacity-30 rounded-xl py-10 space-y-20 flex flex-col items-center">
                    <h1 className="text-xl md:text-3xl\
                    font-bold">Admin</h1>
                 <AdminLoginForm/>
                 </div>
             </div>
         </div>
    )
}

export default AdminLoginPage