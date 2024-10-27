import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyJWT=asyncHandler(async (req,res,next)=>{
try {
    const Token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
    if(!Token){
        throw new ApiError(401,"unauthherized Request")
    }
    const decodedToken=jwt.verify(Token,process.env.ACCESS_TOKEN_SECRE)
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
        throw ApiError(401,"invalod access token")
    }
    req.user=user
} catch (error) {
    throw new ApiError(404,"user are invalide")
    
}
}
)
export {verifyJWT}