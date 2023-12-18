

function PostShimmer() {
  return (
    <div className="w-[95%] h-max md:h-[500px]  flex flex-col md:flex-row space-y-2  md:space-y-2 md:space-x-4 ">

            {/*profile details image and caption */}
            <div className="w-full md:w-[60%] h-max md:h-full space-y-3 md:space-y-2 " >
                <div className="h-[5%] md:h-[10%] w-[50%] flex items-center space-x-2">
                <img  className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-200"  alt=""/>
                <div className="flex flex-col">
                 <h1 className="text-sm font-semibold md:font-bold">Loading...</h1>
                 <h6 className="text-xs md:text-sm">Loading...</h6>
                </div>
                </div>           
                <div className="h-[60%] md:h-[65%] w-full">
                   <img className="w-[99%] h-full bg-slate-200"  alt=""/>
                </div>
                <div className=" flex justify-between">
                <div className="flex space-x-1">
                
                     <img  className="w-[25px] h-[25px] cursor-pointer " src="/assets/icons/icons8-love-black-48.png" alt=""/>
    
                  <h1>... Likes</h1>
                </div>
                </div>
                <div className="h-max w-full">
                <p className="text-xs md:text-sm">Loading...</p>
                </div>
            </div>

            {/* add comment and comments */}
            <div className="w-full md:w-[40%] h-[33%] md:h-full space-y-3 md:space-y-2">
              <div className="flex w-full h-[10%] md:h-[13%] items-center space-x-2">
              <img className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-200"  alt=""/>
              <textarea   className="w-[75%] bg-slate-100 rounded-3xl pt-2 px-[10px]  md:pt-4 md:px-[18px] placeholder:text-xs md:placeholder:text-sm" placeholder="Type comment here ..." />

                 <img  className="w-8 md:w-10 h-8 md:h-10 cursor-not-allowed " src="/assets/icons/icons8-send-letter-50.png" alt="" />
 
              </div>
              <div className="flex items-center">
              <h1 className="text-xs  md:text-sm font-bold">Comments(...)</h1>
              </div>
              <div className=" w-full h-[75%] md:h-[80%] space-y-3 overflow-y-scroll" style={{ overflow: 'auto' }}>

              <div className="h-max flex items-center space-x-2">
        <img className="w-8 h-8 rounded-full bg-slate-200"  alt=""/>
          <div className="flex flex-col w-[89%] space-y-1 bg-slate-50 p-1  rounded-xl">
            <div className="flex w-full justify-between items-center">
             <h1 className="font-bold text-xs md:text-md">Loading...</h1>
             <div className="flex items-center space-x-1">
             <h1 className="text-xs">Loading...</h1>       
                <img  className="w-4 h-4 cursor-pointer" src="/assets/icons/icons8-edit-30.png" alt=""/>
             </div>
             
            </div>            
          </div>
       </div>   
                                
                </div> 
            </div>        
        </div>
  )
}

export default PostShimmer