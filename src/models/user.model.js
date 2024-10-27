import mongoose, {Schema} from "mongoose";

const userSchema=new Schema({
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    index:true

},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true

},
fullname:{
    type:String,
    required:true,
     index:true,
trim:true
},
avatar:{
    type:String,
    required:true,
        
},
coverImage:{
    type:String,
        
},
watchHistory:{
    type:Schema.Types.ObjectId,
    ref:"video"
        
},
password:{
    type:String,
    required:true,
        
},
refreshToken:{
    type:String
        
},
},{
    timestamps:true
})
  
userSchema.pre("save",async function (next){
if(!this.isModified("password"))  return next();

this.password= await bcrypt.hash(this.password,10);
next();
}   
)

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken=function () {
jwt.sign(
    {
_id:this_id,
email:this.email,
username:this.username,
fullname:this.fullname
},
process.env.ACCESS_TOKEN_SECRET,
{
    expirein:process.env.ACCESS_TOKEN_EXPIRY

}
)}

userSchema.methods.generateRefreshToken=function () {
    jwt.sign(
        {
    _id:this_id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expirein:process.env.REFRESH_TOKEN_EXPIRY,
    
    }
    )
}


export const User=mongoose.model('User',userSchema)