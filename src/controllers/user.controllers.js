import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../routes/user.model.js"
import {ApiError} from "../utils/ApiError.js"
//import { upload } from "../middlewares/multer.middleware.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const regiterUser=asyncHandler(async (req,res) => {
const {fullNmae,email,password,username}=req.body  
console.log("email",email)  
if([email,password,username,fullNmae].some((field)=>
field?.trim()==="")){
    console.log(400,"all field are requerd ")
    
}
const existedUser=await User.findOne({
    $or:[{username},{email}]
})
if(!existedUser){
    throw new ApiError(409,"username,email are already exist")
}
const avatarLocalPath=rq.files?.avatar[0]?.path;

const coverImageLocalPath=rq.files?.coverImage[0]?.path;
if(!avatarLocalPath){
throw new ApiError(400,"avatar file is requerd")    
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)
if(!avatar){
    throw new ApiError(400,"avatar file is requerd")
}


 const user=  await User.create({
    fullNmae,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()
})
const createUser=await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createUser){
    throw new ApiError(500,"something went wrong");

}
return res.status(201).json(
    new ApiResponse(200,createUser,"user registered succesfully")
)
})
const loginUser=asyncHandler(async(req,res)=>{
 const [email,username,password]=req.body
 console.log(email)
 if(!username && !email){
    throw new ApiError(400,"user or email are requered ")
 }
 const user=await User.findById({
    $or:[{username},{password}]
 })
 if(!user){
    throw new ApiError(404,"user are not register")
 }
const isPasswordValid=await user.isPasswordCorrect(password);
if(!isPasswordValid){
    new ApiError(401 ,"user password are not valit")
}
const[accessToken,refreshToken]=await generateAccesTokenAndRefreshTokens(user._id)
const loggedInUser=await user.findById(user._id).select("-password,-refreshToken")

const options={
    httpOnly:true,
    secure:true

}
return res.status(200)
.cookie("accesToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in succesfully"
    )
)
    
})





    export {regiterUser,loginUser}