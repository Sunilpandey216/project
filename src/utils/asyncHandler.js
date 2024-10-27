

const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
}}
 
export {asyncHandler};

/*
const asyncHandler=async(fn)=>(){
    try{
await fn(req,res,next)
    }.catch(){

    }
}*/