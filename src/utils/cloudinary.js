import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.cloudinary_name, 
    api_key: process.env.cloudinary_id, 
    api_secret:process.env. cloudinary_secret
});


const uploadOnCloudinary=async (fileupload) =>{
try{
    // Upload an image
    if(!fileupload) return null
     const uploadResult = await cloudinary.uploader
       .upload(fileupload, {
               resource_type:"auto",})
        //console.log("uploaded",uploadResult)
        fs.unlinkSync(fileupload)
return uploadResult;
        } catch(error){
fs.unlinkSync(fileupload)
return null;

       }
    }
export {uploadOnCloudinary}
       