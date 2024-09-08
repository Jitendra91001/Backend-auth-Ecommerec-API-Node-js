const fs = require('fs');
const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: "jitendrayadav12", 
  api_key: "572276179462226", 
  api_secret:"rvZGdU71ifjjCVFHrCqELKpMzUc"
});
const cloudnaryonCloud =async function(localFilepath){
    try {
        if(!localFilepath) return null;

       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type : "auto"
        })

        console.log("file is uploded on cloudnary",response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilepath);
        return null
    }
};

module.exports = cloudnaryonCloud